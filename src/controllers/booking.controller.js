const { SuccessResponse } = require("../core/success.response");
const bookingService = require("../services/booking.service");

class BookingController{
    checkoutbooking = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get checkout booking success",
            metadata: await bookingService.checkoutReviewBooking({ show_time_id: req.params.showtime_id, payload: req.body })
        }).send(res);
    }

    createBooking = async ( req, res, next ) => {
        new SuccessResponse({
            message: "create booking success",
            metadata: await bookingService.createBooking({ userId: req.userId, email: req.email, payload: req.body })
        }).send(res);
    }

    getBookingById = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get Booking success",
            metadata: await bookingService.getBookingById(req.params.id)
        }).send(res);
    }

    getAllBooking = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get All Booking success",
            metadata: await bookingService.getBooking(req.query)
        }).send(res);
    }
}


module.exports = new BookingController();