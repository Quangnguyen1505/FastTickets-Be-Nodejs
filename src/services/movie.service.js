const { BadRequestError } = require('../core/error.response');
const db = require('../models');

class MovieFactory {
    static async createMovie( payload ) {
        const { title, image, content, time, director, 
                performer, movie_type, movie_status,country, price = null } = payload;
        
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

    static async getMovies() {
        return await db.Movie.findAll();
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
}

module.exports = MovieFactory