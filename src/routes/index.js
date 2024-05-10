const express = require('express');
const router = express.Router();

router.use('/v1/api/access', require('./Access'));
router.use('/v1/api/movie', require('./Movie'));
router.use('/v1/api/cinema', require('./Cinema'));
router.use('/v1/api/reservation', require('./Reservation'));

module.exports = router