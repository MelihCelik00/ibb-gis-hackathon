const Model = require('../../models/');
const District = Model.District;
const Category = Model.Category;
const Limit = Model.Limit;
const Distance = Model.Distances;
const CulturalAssets = Model.CulturalAssets;
const Ratings = Model.Ratings;
const cors = require('cors');
const { Op } = require("sequelize");
const sequelize = require('sequelize');

const getDistricts = async (req, res, next) => {
    try {
        const districts = await District.findAll({
            attributes: ['id', 'name', 'geom', 'xcoord', 'ycoord'],
            paranoid: false
        });
        if (!districts || !districts.length)
            return res.status(404).json({ message: "Districts not found!" });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
        return res.status(200).json(districts);
    } catch (error) {
        next(error);
    }
};

const getDistrictsAsGeoJSON = async (req, res, next) => {
    try {
        const districts = await District.findAll({
            attributes: ['id', 'name', 'geom', 'xcoord', 'ycoord'],
            paranoid: false
        });

        // console.log(districts);
        if (!districts || !districts.length)
            return res.status(404).json({ message: "Districts not found!" });

        const poiCount = await CulturalAssets.findAll({
            attributes: ['district', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['district'],
            paranoid: false
        });

        const finalData = await districts.map((district) => {
            // find the related poi count with poiCount.district==district.name
            const poi = poiCount.find((poi) => poi.dataValues.district.toUpperCase() === district.name.toUpperCase());            console.log(poi); 
            return {
                id: district.id,
                name: district.name,
                xcoord: district.xcoord,
                ycoord: district.ycoord,
                count: poi ? poi.dataValues.count : 0,
                geom: district.geom
            };
        });

        // create a general feature collection of all districts
        const geojson = {
            type: 'FeatureCollection',
            features: finalData.map((district) => {
                return {
                    type: 'Feature',
                    properties: {
                        id: district.id,
                        name: district.name,
                        xcoord: district.xcoord,
                        ycoord: district.ycoord,
                        count: district.count
                    },
                    geometry: district.geom
                };
            })
        };
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        return res.status(200).json(geojson);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll({
            attributes: ['id', 'type'],
            paranoid: false
        });

        if (!categories || !categories.length)
            return res.status(404).json({ message: "Categories not found!" });

        return res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

const getBuffers = async (req, res, next) => {
    try {
        const buffers = await Limit.findAll({
            attributes: ['class', 'limit', 'time'],
            paranoid: false
        });

        if (!buffers || !buffers.length)
            return res.status(404).json({ message: "Buffers not found!" });

        return res.status(200).json(buffers);
    } catch (error) {
        next(error);
    }
};

const getSuggestion = async (req, res, next) => {
    try {
        const { districtId  , categoryId, bufferSizeId } = req.query;
        
        // bufferSizeId'ye göre metre bul limit tableından
        const buffer = await Limit.findOne({
            where: {
                id: bufferSizeId
            },
            attributes: ['limit'],
            paranoid: false
        });

        if (!buffer)
            return res.status(404).json({ message: "Buffer not found!" });

        let culturalAssets;
        if (categoryId) {
            culturalAssets = await CulturalAssets.findAll({
            where: {
                type: categoryId
            },
            attributes: ['id'],
            paranoid: false
            });
        } else {
            culturalAssets = await CulturalAssets.findAll({
            attributes: ['id'],
            paranoid: false
            });
        }

        const culturalAssetIds = culturalAssets.map(asset => asset.id);

            // distance değeri bufferdan küçük veya eşit olan ve districtId ve categoryId'ye göre bul
        const places = await Distance.findAll({
            where: {
                inputId: districtId,
                distance: {
                    [Op.lte]: buffer.limit
                },
                targetId: {
                    [Op.in]: culturalAssetIds
                }
            },
            attributes: ['targetId', 'distance'],
            paranoid: false
        });        

        if (!places || !places.length)
            return res.status(404).json({ message: "Places not found!" });

        const ratings = await Ratings.findAll({
            where: {
                placeId: {
                    [Op.in]: culturalAssetIds
                }
            },
            attributes: ['placeId', 'point'],
            paranoid: false
        });


        const groupedRatings = ratings.reduce((acc, curr) => {
        const existing = acc.find(item => item.placeId === curr.placeId);
        if (existing) {
            existing.total += curr.point;
            existing.count += 1;
            existing.average = existing.total / existing.count;
        } else {
            acc.push({
            placeId: curr.placeId,
            total: curr.point,
            count: 1,
            average: curr.point
            });
        }
        return acc;
        }, []);
        
        
            // Birleştirilmiş veri seti
        const birlesikVeri = places.map((place) => {
            const ilgiliRating = groupedRatings.find((ratingData) => ratingData.placeId === place.targetId);
        
            // Uygun placeId'ye sahip rating verisi bulundu mu kontrol et
            if (ilgiliRating) {
            // İlgili average değerini ekleyerek birleştir
            return {
                id: place.targetId,
                distance: place.distance,
                average: ilgiliRating.average,
            };
            } else {
            // Eşleşen placeId bulunamadıysa sadece places verisini kullan
            return {
                id: place.targetId,
                distance: place.distance,
                average: -1, // ya da istediğiniz bir değer
            };
            }
        });

        birlesikVeri.sort((a, b) => {
            // -1 olanları filtrele
            if (a.average === -1) return 1;
            if (b.average === -1) return -1;
          
            const oranA = a.average / a.distance;
            const oranB = b.average / b.distance;
          
            // Büyük oran daha iyi, küçük oran daha kötü olacak şekilde sırala
            return oranB - oranA;
          });

        const siraliVeri = birlesikVeri.map((item) => ({
            id: item.id,
            distance: item.distance,
            average: item.average,
            oran: item.average !== -1 ? (item.average / item.distance ) * 10000 : null,
        }));

        return res.status(200).json(siraliVeri);
    } catch (error) {
        next(error);
    }
};

const getPlaceInfo = async (req, res, next) => {
    try {
      const { placeId } = req.query;
  
      const place = await CulturalAssets.findOne({
        where: {
          id: placeId
        },
        attributes: ['name', 'desc', 'image'],
        paranoid: false
      });
  
      if (!place)
        return res.status(404).json({ message: "Place not found!" });
  
      return res.status(200).json(place);
    } catch (error) {
      next(error);
    }
  };
   

module.exports = {
    getDistricts,
    getCategories,
    getBuffers,
    getSuggestion,
    getPlaceInfo,
    getDistrictsAsGeoJSON
}