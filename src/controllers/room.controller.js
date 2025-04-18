const { SuccessResponse } = require("../core/success.response");
const roomService = require("../services/room.service");

class RoomController{
    createRoom = async ( req, res, next ) => {
        new SuccessResponse({
            message: "create Room success",
            metadata: await roomService.createRoom(req.body)
        }).send(res);
    }

    updateRoom = async ( req, res, next ) => {
        const payload = req.body;
        new SuccessResponse({
            message: "update Room success",
            metadata: await roomService.updateRoom( req.params.roomId, payload )
        }).send(res);
    } 


    getRoomById = async (req,res,next) => {
        new SuccessResponse({
            message: "get Room by Id success",
            metadata: await roomService.getRoomById(req.params.roomId)
        }).send(res);
    }

    getAllRoom = async (req,res,next) => {
        new SuccessResponse({
            message: "get all Room success",
            metadata: await roomService.getAllRoom(req.query)
        }).send(res);
    }

    deleteRoom = async (req,res,next) => {
        new SuccessResponse({
            message: "delete Room success",
            metadata: await roomService.deleteRoomById(req.params.roomId)
        }).send(res);
    }
}


module.exports = new RoomController();