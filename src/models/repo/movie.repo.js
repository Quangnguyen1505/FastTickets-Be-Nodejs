const db = require('../../models');

const foundMovieById = async ( movieId ) => {
    const foundMovie = await db.Movie.findOne({
        where: {
            id: movieId
        }
    })

    return foundMovie
}


module.exports = {
    foundMovieById
}