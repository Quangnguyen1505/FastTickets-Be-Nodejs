const express = require('express');
const bookingController = require('../../controllers/booking.controller');
const router = express.Router();
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.post("/checkout/:showtime_id", handlerError(bookingController.checkoutbooking));
router.get("/:id", handlerError(bookingController.getBookingById));
// router.get("/user/:userId", handlerError(bookingController.getBookingByUserId));

router.use(authencationV2);

router.get("", handlerError(bookingController.getAllBooking));
router.post("",  handlerError(bookingController.createBooking));



module.exports = router