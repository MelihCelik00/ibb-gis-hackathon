const router = require('express').Router();

router.use('/places', require('../components/place/place.route'));

module.exports = router;