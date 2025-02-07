const express = require('express');
const router = express.Router();

router.use('/v1/api/access', require('./Access'));
router.use('/v1/api/role', require('./Role'));
router.use('/v1/api/auth', require('./Oauth2'));
router.use('/v1/api/event', require('./Event'));
router.use('/v1/api/movie', require('./Movie'));
router.use('/v1/api/showtime', require('./Showtime'));
router.use('/v1/api/cate', require('./Category'));
router.use('/v1/api/room', require('./Room'));
router.use('/v1/api/seat', require('./Seats'));
router.use('/v1/api/booking', require('./Booking'));
router.use('/v1/api/upload', require('./upload'));

module.exports = router