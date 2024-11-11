const express = require('express');
const router = express.Router();
const seatController = require('../../controllers/seat.controller');
const { handlerError } = require('../../helper/asyncHandler');

router.get('/:seatId', handlerError(seatController.findSeatById));
router.get('', handlerError(seatController.findAllSeats));

module.exports = router;