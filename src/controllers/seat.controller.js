const { SuccessResponse } = require("../core/success.response");
const seatService = require("../services/seat.service");

class SeatController{
    findSeatById = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get seat by id success",
            metadata: await seatService.findSeatById(req.params.seatId)
        }).send(res);
    }

    findAllSeats = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get all seat success",
            metadata: await seatService.findAllSeat(req.query)
        }).send(res);
    }
}


module.exports = new SeatController();