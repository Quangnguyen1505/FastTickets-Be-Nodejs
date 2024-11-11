const express = require('express');
const bookingController = require('../../controllers/booking.controller');
const router = express.Router();
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.get("/checkout/:roomId", handlerError(bookingController.checkoutbooking));
router.get("/:id", handlerError(bookingController.getBookingById));
router.get("", handlerError(bookingController.getAllBooking));

router.use(authencationV2);

router.post("/create",  handlerError(bookingController.createBooking));



module.exports = router