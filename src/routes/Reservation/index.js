const express = require('express');
const ReservationController = require('../../controllers/reservation.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.get("/checkout/:movieId", handlerError(ReservationController.checkoutReservation));

router.use(authencationV2);

router.post("/create",  handlerError(ReservationController.createReservation));



module.exports = router