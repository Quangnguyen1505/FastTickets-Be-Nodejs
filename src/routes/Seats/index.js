const express = require('express');
const router = express.Router();
const seatController = require('../../controllers/seat.controller');
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.get('/:seatId', handlerError(seatController.findSeatById));
router.get('', handlerError(seatController.findAllSeats));

router.use(authencationV2);

router.put('/:seatId', handlerError(seatController.updateStatusSeat));
router.post('/hold-seat', handlerError(seatController.holdSeat));
router.post('/release-seat', handlerError(seatController.releaseSeat));

module.exports = router;