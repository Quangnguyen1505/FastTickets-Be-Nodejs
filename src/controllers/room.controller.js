const { SuccessResponse } = require("../core/success.response");
const roomService = require("../services/room.service");

class RoomController{
    createRoom = async ( req, res, next ) => {
        new SuccessResponse({
            message: "create Room success",
            metadata: await roomService.createRoom(req.body)
        }).send(res);
    }

    // updateCinema = async ( req, res, next ) => {
    //     const movieId = req.body.movieId, payload = req.body.payload;
    //     new SuccessResponse({
    //         message: "update Cinema success",
    //         metadata: await MovieService.updateMovie( movieId, payload )
    //     }).send(res);
    // } 

    insertMovieToRoom = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Insert movie to Room success",
            metadata: await roomService.insertMovieToRoom(req.body)
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
}


module.exports = new RoomController();