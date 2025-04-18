const { BadRequestError } = require('../../core/error.response');
const db = require('../../models');
const { Op } = require('sequelize');

const foundMovieById = async ( movieId ) => {
    const foundMovie = await db.Movie.findOne({
        where: {
            id: movieId
        }
    })

    return foundMovie
}

const foundMovieByName = async ( movie_title ) => {
    const foundMovie = await db.Movie.findOne({
        where: {
            movie_title
        }
    })

    return foundMovie
}

const searchMovie = async (movie_title) => {
    const movies = await db.Movie.findAll({
    where: {
        title: {
        [Op.iLike]: `%${movie_title}%`
        }
    }
    });
    if(!movies) throw new BadRequestError('movie not exists');
    return movies;
  };


module.exports = {
    foundMovieById,
    searchMovie,
    foundMovieByName
}