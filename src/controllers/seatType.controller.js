const { SuccessResponse } = require("../core/success.response");
const seatTypeService = require("../services/seatType.service");

class SeatController{
    findSeatTypeById = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get seat type by id success",
            metadata: await seatTypeService.findSeatTypeById(req.params.seatTypeId)
        }).send(res);
    }

    findAllSeatTypes = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get all seat success",
            metadata: await seatTypeService.findAllSeatType(req.query)
        }).send(res);
    }

    createSeatType = async ( req, res, next ) => {
        new SuccessResponse({
            message: "create seat type success",
            metadata: await seatTypeService.createSeatType(req.body)
        }).send(res);
    }

    updateSeatType = async (req, res, next) => {
        new SuccessResponse({
            message: "update seat type success",
            metadata: await seatTypeService.updateSeatType(req.params.id, req.body)
        }).send(res);
    }

    deleteSeatType = async (req, res, next) => {
        new SuccessResponse({
            message: "delete seat type success",
            metadata: await seatTypeService.deleteSeatType(req.params.id)
        }).send(res);
    }
}


module.exports = new SeatController();