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
}


module.exports = new ReservationController();