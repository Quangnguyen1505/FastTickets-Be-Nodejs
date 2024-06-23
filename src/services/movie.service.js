const { BadRequestError } = require('../core/error.response');
const db = require('../models');
const { searchMovie } = require('../models/repo/movie.repo');

class MovieFactory {
    static async createMovie( payload ) {
        const { title, image, content, time, director, 
                performer, movie_type, movie_status, country, price } = payload;
        
        const newMovie = await db.Movie.create({ title, image, content, time, director, 
            performer, movie_type, movie_status, country, price });

        if(!newMovie) throw new BadRequestError("create Movie error");

        return newMovie;
    }

    static async getMovieById( movieId ) {
        return await db.Movie.findOne({
            where: { id: movieId }
        })
    }

    static async getMovies({ limit = 30, sort = 'ctime', page = 1 }) {
        const skip = ( page - 1 ) * limit;
        const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1};
        return await db.Movie.findAll({
            limit,
            sort: sortBy,
            skip,
        });
    }

    static async updateMovie( movieId, payload ) {
        console.log("payload", movieId);
        const movie = await db.Movie.findOne({
            where: { id: movieId }
        });

        if(!movie) throw new BadRequestError("Movie not found");

        const updateMovie = await db.Movie.update(payload, {
            where: { id: movieId }
        });

        return updateMovie;
    }

    static async searchMovie(movie_title) {
        const foundMovie = await searchMovie(movie_title);
        return foundMovie;
    }
}

module.exports = MovieFactory