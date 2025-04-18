const { SuccessResponse } = require("../core/success.response");
const MovieService = require("../services/movie.service");

class MovieController{
    createMovie = async ( req, res, next ) => {
        console.log("body and file", req.body, req.file)
        const filePath = req.file.path;
        new SuccessResponse({
            message: "create movie success",
            metadata: await MovieService.createMovie(req.body, filePath)
        }).send(res);
    }

    updateMovie = async ( req, res, next ) => {
        const movieId = req.params.id, payload = req.body;
        const filePath = req.file ? req.file.path : null;
        new SuccessResponse({
            message: "update movie success",
            metadata: await MovieService.updateMovie( movieId, payload, filePath )
        }).send(res);
    } 

    getMovieById = async (req,res,next) => {
        new SuccessResponse({
            message: "get movie by Id success",
            metadata: await MovieService.getMovieById(req.params.id)
        }).send(res);
    }

    getAllMovie = async (req,res,next) => {
        new SuccessResponse({
            message: "get all movie success",
            metadata: await MovieService.getMovies(req.query)
        }).send(res);
    }

    searchMovieByTitle = async (req,res,next) => {
        const movie_title = req.params.title;
        new SuccessResponse({
            message: "search movie success",
            metadata: await MovieService.searchMovie(movie_title)
        }).send(res);
    }

    deleteMovie = async (req,res,next) => {
        new SuccessResponse({
            message: "delete movie success",
            metadata: await MovieService.deleteMovieById(req.params.id)
        }).send(res);
    }
}


module.exports = new MovieController();