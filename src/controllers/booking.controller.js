const { SuccessResponse } = require("../core/success.response");
const bookingService = require("../services/booking.service");

class BookingController{
    checkoutbooking = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get checkout booking success",
            metadata: await bookingService.checkoutReviewBooking({ 
                show_time_id: req.params.showtime_id, 
                payload: req.body,
                userId: req.userId
            })
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
        console.log("req.query", req.query)
        new SuccessResponse({
            message: "get All Booking success",
            metadata: await bookingService.getBooking(req.query)
        }).send(res);
    }

    getBookingsByUserId = async ( req, res, next ) => {
        console.log("req.userId", req.userId)
        new SuccessResponse({
            message: "get Bookings by UserId success",
            metadata: await bookingService.getBookingByUserId(req.userId, req.query)
        }).send(res);
    }

    updateStatusBooking = async ( req, res, next ) => {
        new SuccessResponse({
            message: "update Booking status success",
            metadata: await bookingService.updateStatusBooking(req.params.id, req.body)
        }).send(res);
    }
}

module.exports = new BookingController();