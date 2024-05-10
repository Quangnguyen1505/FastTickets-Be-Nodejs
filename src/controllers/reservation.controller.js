const { SuccessResponse } = require("../core/success.response");
const reservationService = require("../services/reservation.service");

class ReservationController{
    checkoutReservation = async ( req, res, next ) => {
        new SuccessResponse({
            message: "create Reservation success",
            metadata: await reservationService.checkoutReviewReservation( req.params.movieId, req.body)
        }).send(res);
    }
}


module.exports = new ReservationController();