const express = require('express');
const router = express.Router();
const showtimeController = require('../../controllers/showtime.controller');
const { handlerError } = require('../../helper/asyncHandler');
router.post('/create', handlerError(showtimeController.createShowTime));
router.delete('/delete/:showtime_id', handlerError(showtimeController.deleteShowTime));

module.exports = router
