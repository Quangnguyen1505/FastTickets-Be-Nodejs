const { SuccessResponse } = require("../core/success.response");
const reservationService = require("../services/reservation.service");

class ReservationController{
    checkoutReservation = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get Reservation success",
            metadata: await reservationService.checkoutReviewReservation({ movieId: req.params.movieId, payload: req.body })
        }).send(res);
    }

    createReservation = async ( req, res, next ) => {
        new SuccessResponse({
            message: "create Reservation success",
            metadata: await reservationService.createReservation({ userId: req.user.userId, payload: req.body })
        }).send(res);
    }

    getReservation = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get Reservation success",
            metadata: await reservationService.getReservationById(req.params.id)
        }).send(res);
    }

    getAllReservation = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get All Reservation success",
            metadata: await reservationService.getReservations(req.query)
        }).send(res);
    }
}


module.exports = new ReservationController();