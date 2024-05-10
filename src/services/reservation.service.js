const { NotFoundError, BadRequestError } = require("../core/error.response");
const { foundMovieById } = require("../models/repo/movie.repo");

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
    static async checkoutReviewReservation( movieId, payload ) {
        const {
            user_order, address = "Xo viet nghe tinh"
        } = payload;
   
        if(!user_order) throw new NotFoundError('Varible invalid!!');

        const foundMovie = await foundMovieById(movieId);
        if(!foundMovie) throw new BadRequestError('Movie not exitst!!');

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

    static async createReservation({ user_order, movieId }) {        
        const { checkoutPrice, address } = await ReservationService.checkoutReviewReservation({
            user_order
        })
        if(!checkoutPrice) throw new NotFoundError("checkout price not exists!!");

        const newReservation = db.Reservation.create({
            // seats: map------
            total_checkout: checkoutPrice
        })

        return newReservation
    }

    static async getReservationById( reservationId ) {

    }

    static async getReservations() {

    }

    static async destroyReservation( reservationId ) {}
}

module.exports = ReservationService