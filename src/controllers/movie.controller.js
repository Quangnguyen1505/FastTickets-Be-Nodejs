const { SuccessResponse } = require("../core/success.response");
const MovieService = require("../services/movie.service");

class MovieController{
    createMovie = async ( req, res, next ) => {
        new SuccessResponse({
            message: "create movie success",
            metadata: await MovieService.createMovie(req.body)
        }).send(res);
    }

    updateMovie = async ( req, res, next ) => {
        const movieId = req.body.movieId, payload = req.body.payload;
        new SuccessResponse({
            message: "update movie success",
            metadata: await MovieService.updateMovie( movieId, payload )
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

    getAllMovieByStatus = async (req,res,next) => {
        new SuccessResponse({
            message: "get all movie by status success",
            metadata: await MovieService.getMoviesByStatus(req.query)
        }).send(res);
    }

    searchMovieByTitle = async (req,res,next) => {
        const movie_title = req.params.title;
        new SuccessResponse({
            message: "search movie success",
            metadata: await MovieService.searchMovie(movie_title)
        }).send(res);
    }
}


module.exports = new MovieController();