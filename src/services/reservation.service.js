const { NotFoundError, BadRequestError } = require("../core/error.response");
const { foundMovieById } = require("../models/repo/movie.repo");
// const { totalPrice } = require("../models/repo/reservation.repo.js");
const db = require('../models');
const { SeatPrice, foundReservationById, foundAllReser } = require("../models/repo/reservation.repo");

class ReservationService {

    // 
    // "user_order": [
    //     {
    //         "seat": "vip",
    //         "location": "h4",
    //         "price": 41000
    //     },
    //     {
    //         "seat": "vip",
    //         "location": "h4",
    //         "price": 41000
    //     }
    // ]
    //
    static async checkoutReviewReservation({ movieId, payload }) {
        const {
            user_order, address = ""
        } = payload;
   
        if(!user_order) throw new NotFoundError('Varible invalid!!');

        const foundMovie = await foundMovieById(movieId);
        if(!foundMovie) throw new BadRequestError('Movie not exitst!!');

        const checkDB = await SeatPrice(foundMovie, user_order);

        const checkPriceExists = checkDB.includes(false);
        if(checkPriceExists) throw new NotFoundError('Price not exists!!');
        

        const checkoutPrice = await user_order.reduce((acc, item) => {
           return acc + item.price  
        },0);

        return {
            checkoutPrice,
            address,
            time_Movie: foundMovie.time,
            user_order
        }

    }

    static async createReservation({ userId, payload }) { 
        const { movieId, user_order, address_order } = payload;      

        const { checkoutPrice, address } = await ReservationService.checkoutReviewReservation({
            movieId, payload: {
                user_order,
                address: address_order
            }
        });
        if(!checkoutPrice) throw new NotFoundError("checkout price not exists!!");

        const seats = await user_order.map( item => item.seat );
        const newReservation = db.Reservation.create({
            user_id: userId,
            movie_id: movieId,
            address: address,
            total_checkout: checkoutPrice,
            user_order
        });

        return newReservation
    }

    static async getReservationById( reservationId ) {
        const foundReservation = await foundReservationById(reservationId);
        if(!foundReservation) throw new BadRequestError("Reservation not exitst!!");

        return foundReservation;
    }

    static async getReservations({ limit = 30, sort = 'ctime', page = 1 }) {
        const foudAllReservations = await foundAllReser({ limit, sort, page, 
            unselect: ['createdAt', 'updatedAt'] 
        });
        if(!foudAllReservations.length) throw new BadRequestError("Reservation not exitst");

        return foudAllReservations;
    }

    static async destroyReservation( reservationId ) {}
}

module.exports = ReservationService