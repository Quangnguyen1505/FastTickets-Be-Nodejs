const { NotFoundError, BadRequestError } = require("../core/error.response");
const db = require('../models');
const { SeatPrice, foundBookingById, foundAllBooking } = require("../models/repo/booking.repo");
const { foundRoomById } = require("../models/repo/room.repo");

class BookingService {

    // 
    // "user_order": [
    //     {
    //         "seat": "vip",
    //         "location": "h4",
    //         "price": 41000,
    //     },
    //     {
    //         "seat": "vip",
    //         "location": "h4",
    //         "price": 41000
    //     }
    // ]
    //
    static async checkoutReviewBooking({ roomId, payload }) {
        const {
            user_order, address = ""
        } = payload;
        if(!user_order) throw new NotFoundError('Varible invalid!!');

        const foundRoom = await foundRoomById(roomId);
        if(!foundRoom) throw new BadRequestError('room not exitst!!');

        const checkDB = await SeatPrice(foundRoom, user_order);

        const checkPriceExists = checkDB.includes(false);
        if(checkPriceExists) throw new NotFoundError('Price not exists!!');
        
        for (var i = 0; i < user_order.length; i++) {
            if(user_order[i].type == 'vip') {
                user_order[i].price += 41;
                console.log("user_order.price", user_order[i].price);
                
            } else if(user_order[i].type == 'normal') {
                user_order[i].price += 31;
                console.log("normal.price", user_order[i].price);
            }
        }
        console.log("priceType", user_order);
        

        const checkoutPrice = await user_order.reduce((acc, item) => {
           return acc + item.price  
        },0);

        return {
            checkoutPrice,
            address,
            user_order
        }

    }

    static async createBooking({ userId, payload }) { 
        const { movieId, roomId, user_order, address_order } = payload;      
        console.log("payload", payload);
        const { checkoutPrice, address } = await BookingService.checkoutReviewBooking({
            roomId, payload: {
                user_order,
                address: address_order
            }
        });
        if(!checkoutPrice) throw new NotFoundError("checkout price not exists!!");
 
        const newBooking = db.Booking.create({
            booking_roomId: roomId,
            booking_seats: user_order,
            booking_userId: userId,
            booking_movieId: movieId,
            booking_address: address,
            booking_total_checkout: checkoutPrice,
        });

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