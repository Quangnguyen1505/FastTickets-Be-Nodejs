const { NotFoundError, BadRequestError } = require("../core/error.response");
const db = require('../models');
const { foundBookingById, foundAllBooking } = require("../models/repo/booking.repo");
const { foundRoomById } = require("../models/repo/room.repo");
const { findSeatByCode } = require("../models/repo/seat.repo");
const { findSeatTypeByName } = require("../models/repo/seat_type.repo");
const { findShowTimeById } = require("../models/repo/showtime.repo");
const { getTicketPrice } = require("./showtime.service");

class BookingService {

    // 
    // "user_order": [
    //     {
    //         "seat": "vip",
    //         "location": "h4",
    //     },
    //     {
    //         "seat": "vip",
    //         "location": "h4",
    //     }
    // ]
    //
    static async checkoutReviewBooking({ show_time_id, payload }) {
        const {
            user_order
        } = payload;
        if(!user_order) throw new NotFoundError('Varible invalid!!');
        
        const foundShowtime = await findShowTimeById(show_time_id)
        if(!foundShowtime) throw new BadRequestError("show time not exists")

        let total_Price = [];

        for (let i = 0; i < user_order.length; i++) {
            let foundSeat = await findSeatByCode(user_order[i].location);
            if (!foundSeat) throw new BadRequestError(`Seat ${user_order[i].location} not exists!!`);
    
            let seat_types = await findSeatTypeByName(user_order[i].type);
            if (!seat_types) throw new BadRequestError("Seat type not exists!!");
    
            let price_ticket = await getTicketPrice(foundShowtime.id, seat_types.id);
            total_Price.push(price_ticket);
    
            user_order[i].seat_id = foundSeat.id; 
        }
    

        const checkoutPrice = await total_Price.reduce((acc, item) => {
           return acc + item
        },0);

        const showtime = {
            show_time_id: foundShowtime.id,
            movie: {
                movie_id: foundShowtime.Movie.id,
                movie_title: foundShowtime.Movie.movie_title
            },
            room: {
                room_id: foundShowtime.Room.id,
                room_name: foundShowtime.Room.room_name
            },
            show_date: foundShowtime.show_date,
            start_time: foundShowtime.start_time,
            end_time: foundShowtime.end_time
        }

        return {
            checkoutPrice,
            user_order,
            showtime
        }

    }

    static async createBooking({ userId, payload }) { 
        const { show_time_id, user_order_book } = payload;
        const { checkoutPrice, showtime, user_order } = await BookingService.checkoutReviewBooking({
            show_time_id, payload: {
                user_order: user_order_book
            }
        });
        if(!checkoutPrice) throw new NotFoundError("checkout price not exists!!");
    
        const newBooking = await db.Booking.create({
            booking_roomId: showtime.room.room_id,
            booking_userId: userId,
            booking_movieId: showtime.movie.movie_id,
            booking_date: showtime.show_date,
            booking_total_checkout: checkoutPrice,
            booking_show_time_id: showtime.show_time_id
        });
        if(!newBooking) throw new BadRequestError("save new booking error")
        
        for (let i = 0; i < user_order.length; i++) {
            let newBookingSeat = await db.booking_seat.create({
                booking_id: newBooking.id,
                seat_id: user_order[i].seat_id
            })
            if(!newBookingSeat) throw new BadRequestError("new booking seat error")
        }
    
        return newBooking
    }

    static async getBookingById( bookingId ) {
        const foundbooking = await foundBookingById(bookingId);
        if(!foundbooking) throw new BadRequestError("Booking not exitst!!");

        return foundbooking;
    }

    static async getBooking({ limit = 30, sort = 'ctime', page = 1 }) {
        const foudAllBookings = await foundAllBooking({ limit, sort, page, 
            unselect: ['createdAt', 'updatedAt'] 
        });
        if(!foudAllBookings.length) throw new BadRequestError("Booking not exitst");

        return foudAllBookings;
    }

    static async destroyReservation( reservationId ) {}
}

module.exports = BookingService