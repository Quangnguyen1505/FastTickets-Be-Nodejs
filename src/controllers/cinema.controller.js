const { SuccessResponse } = require("../core/success.response");
const cinemaService = require("../services/cinema.service");

class CinemaController{
    createCinema = async ( req, res, next ) => {
        new SuccessResponse({
            message: "create Cinema success",
            metadata: await cinemaService.createCinema(req.body)
        }).send(res);
    }

    // updateCinema = async ( req, res, next ) => {
    //     const movieId = req.body.movieId, payload = req.body.payload;
    //     new SuccessResponse({
    //         message: "update Cinema success",
    //         metadata: await MovieService.updateMovie( movieId, payload )
    //     }).send(res);
    // } 

    getCinemaById = async (req,res,next) => {
        new SuccessResponse({
            message: "get Cinema by Id success",
            metadata: await cinemaService.getCinemaById(req.params.cinemaId, req.params.movieId )
        }).send(res);
    }

    getAllCinema = async (req,res,next) => {
        new SuccessResponse({
            message: "get all Cinema success",
            metadata: await cinemaService.getAllCinema()
        }).send(res);
    }
}


module.exports = new CinemaController();