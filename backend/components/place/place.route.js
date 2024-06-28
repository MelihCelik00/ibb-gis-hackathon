const router = require('express').Router();
const placeController = require('./place.controller');

router.get('/districts', placeController.getDistricts);

router.get('/districts/geojson', placeController.getDistrictsAsGeoJSON);

router.get('/categories', placeController.getCategories);

router.get('/buffers', placeController.getBuffers);

router.get('/suggestion', placeController.getSuggestion);

router.get('/place', placeController.getPlaceInfo);

module.exports = router;