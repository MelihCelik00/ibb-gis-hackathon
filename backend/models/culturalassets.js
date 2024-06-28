'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CulturalAssets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CulturalAssets.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    geom: DataTypes.GEOMETRY,
    fid: DataTypes.INTEGER,
    name: DataTypes.STRING,
    disctrict: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    long: DataTypes.DOUBLE,
    type: DataTypes.STRING,
    desc: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CulturalAssets',
    timestamps: false,
    paranoid: false
  });
  return CulturalAssets;
};