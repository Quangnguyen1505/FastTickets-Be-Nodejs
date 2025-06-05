const { SuccessResponse } = require("../core/success.response");
const { acquireLock, releaseLock } = require("../services/redis.service");
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

    updateStatusSeat = async ( req, res, next ) => {
        const { seat_status, showtime_id } = req.body;
        new SuccessResponse({
            message: "update status seat success",
            metadata: await seatService.updateStatusSeat({seatId: req.params.seatId, seat_status, showtime_id})
        }).send(res);
    }

    holdSeat = async ( req, res, next ) => {
        new SuccessResponse({
            message: "update status seat success",
            metadata: await acquireLock(req.body)
        }).send(res);
    }

    releaseSeat = async ( req, res, next ) => {
        new SuccessResponse({
            message: "release seat success",
            metadata: await releaseLock(req.body)
        }).send(res);
    }
}


module.exports = new SeatController();