const express = require('express');
const bookingController = require('../../controllers/booking.controller');
const router = express.Router();
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const { checkAdmin } = require('../../middlewares/cache/checkAdmin.midlewares');

router.post("/checkout/:showtime_id", handlerError(bookingController.checkoutbooking));
router.get("/:id", handlerError(bookingController.getBookingById));

router.use(authencationV2);
router.get("/history/users", handlerError(bookingController.getBookingsByUserId));
router.post("",  handlerError(bookingController.createBooking));
router.put("/:id", handlerError(bookingController.updateStatusBooking));

router.use(checkAdmin);
router.get("", handlerError(bookingController.getAllBooking));


module.exports = router