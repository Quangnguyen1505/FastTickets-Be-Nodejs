const express = require('express');
const router = express.Router();

router.use('/v1/api/access', require('./Access'));
router.use('/v1/api/users', require('./Users'));
router.use('/v1/api/roles', require('./Role'));
router.use('/v1/api/oauth', require('./Oauth2'));
router.use('/v1/api/movies', require('./Movie'));
router.use('/v1/api/showtimes', require('./Showtime'));
router.use('/v1/api/categories', require('./Category'));
router.use('/v1/api/rooms', require('./Room'));
router.use('/v1/api/seats', require('./Seats'));
router.use('/v1/api/seat-types', require('./SeatTypes'));
router.use('/v1/api/bookings', require('./Booking'));
router.use('/v1/api/upload', require('./Upload'));

module.exports = router