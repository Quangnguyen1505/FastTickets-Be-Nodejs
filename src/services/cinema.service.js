const { BadRequestError, NotFoundError } = require('../core/error.response');
const db = require('../models');
const { foundCinameById, foundAllCinema } = require('../models/repo/cinema.repo');
const { foundMovieById } = require('../models/repo/movie.repo');

//
// "cinema_name" : "cinema 1",
// "ciname_seat": [
//     {
//         "name": "normal",
//         "quantity": 10
//     },
//     {
//         "name": "vip",
//         "quantity": 15
//     },
//     {
//         "name": "couple",
//         "quantity": 5
//     }
// ],
// movie_playing: [
//     1,2,3,4
// ]

class CinemaService{
    static async createCinema( payload ){
        const {
            cinema_name, cinema_seat, movie_playing
        } = payload;
        console.log("payload ", payload);
        if(!cinema_name || !cinema_seat || !movie_playing ) throw new NotFoundError('varible invalid!!');
        
        const newCinema = await db.Cinema.create({
            cinema_name, cinema_seat, movie_playing
        });
        if(!newCinema) throw new BadRequestError('New Cinema failed!!');

        return newCinema;
    }

    static async getCinemaById( cinemaId, movieId ){
        if(!cinemaId || !movieId) throw new NotFoundError('seatId invalid!!');
        console.log("movie::", cinemaId, movieId);

        const foundCinema = await foundCinameById(cinemaId);
        if(!foundCinema) throw new BadRequestError('Cinema not exists!');

        const foundMovie = await foundMovieById(movieId);
        if(!foundMovie) throw new BadRequestError('Movie not exists!!')

        return {
            foundSeat,
            price: foundMovie.price
        };
    }

    static async getAllCinema (){
        const foundSeats = await foundAllCinema();
        if(!foundSeats.length) throw new BadRequestError('Cinema length not exists!!');

        return foundSeats;
    }
}

module.exports = CinemaService