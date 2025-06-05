const { NotFoundError, BadRequestError } = require("../core/error.response");
const db = require('../models');
const { foundBookingById, foundAllBooking, foundBookingByUserId } = require("../models/repo/booking.repo");
const { findSeatByCode } = require("../models/repo/seat.repo");
const { findSeatTypeByName } = require("../models/repo/seat_type.repo");
const { findShowTimeById } = require("../models/repo/showtime.repo");
const { producerSendToExchange } = require("../queue/services/sendMailBooking");
const { releaseLock, acquireLock } = require("./redis.service");
const { updateStatusSeat } = require("./seat.service");
const { getTicketPrice } = require("./showtime.service");
const { snackClient, discountClient } = require("../grpc/client/init.client");
const { notificationClient } = require("../grpc/client/init.client");

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
    // ],
    // "snacks_order": [
    //     {
    //         "snack_id": "1",
    //         "quantity": 1,
    //         "price": 100000
    //     },
    //     {
    //         "snack_id": "2",
    //         "quantity": 1,
    //         "price": 100000
    //     }
    // ]
    static async checkoutReviewBooking({ show_time_id, payload, methodChatbot = false }) {
        const {
            user_order,
            snacks_order,
            discount_id = null
        } = payload;
        console.log("user_order", user_order);
        if(!user_order) throw new NotFoundError('Varible invalid!!');
        
        const foundShowtime = await findShowTimeById({showtime_id: show_time_id})
        if(!foundShowtime) throw new BadRequestError("show time not exists")

        let total_Price = [];
        let seatStatus = methodChatbot ? 'available' : 'reserved';

        for (let i = 0; i < user_order.length; i++) {
            let foundSeat = await findSeatByCode(user_order[i].location, seatStatus, show_time_id);
            
            if (!foundSeat) throw new BadRequestError(`Seat ${user_order[i].location} not exists!!`);
    
            let seat_types = await findSeatTypeByName({name: user_order[i].type});
            if (!seat_types) throw new BadRequestError("Seat type not exists!!");
    
            let price_ticket = await getTicketPrice(foundShowtime.id, seat_types.id);
            total_Price.push(price_ticket);
            user_order[i].price = price_ticket;
            user_order[i].quantity = 1;
            user_order[i].stt = Number(i) + Number(1);
            user_order[i].seat_id = foundSeat.seat_id; 
        }

        let snacks_order_detail = [];
        if (snacks_order) {
            for (let i = 0; i < snacks_order.length; i++) {
                const snackDetail = await getSnackDetail(snacks_order[i].snack_id);
                if (!snackDetail?.snack) {
                    throw new BadRequestError("Snack not exists!!");
                }
            
                const price = snackDetail.snack.item_price * snacks_order[i].quantity;
                total_Price.push(price);
                snacks_order_detail.push({
                    name: snackDetail.snack.item_name,
                    quantity: snacks_order[i].quantity,
                    price: price
                });
            }
        }

        console.log("total_Price", total_Price);

        let checkoutPrice = total_Price.reduce((acc, item) => {
           return acc + item
        },0);

        if (discount_id) {
            const discount = await new Promise((resolve, reject) => {
                discountClient.GetDiscount({ id: discount_id }, (err, discount) => {
                    if (err || !discount) return reject(new BadRequestError("Discount not exists!!"));
                    return resolve(discount);
                });
            });

            const { discount_is_active, discount_end_date, discount_value, discount_type } = discount;

            if (!discount_is_active || new Date(discount_end_date) < new Date()) {
                throw new BadRequestError("Discount is invalid or expired!");
            }

            if (discount_type === "PERCENTAGE") {
                const percent = Math.min(discount_value, 100);
                checkoutPrice = checkoutPrice - (checkoutPrice * percent) / 100;
            } else if (discount_type === "AMOUNT") {
                checkoutPrice = Math.max(0, checkoutPrice - discount_value);
            }
        }

        const showtime = {
            show_time_id: foundShowtime.id,
            movie: {
                movie_id: foundShowtime.Movie.id,
                movie_title: foundShowtime.Movie.movie_title,
                age_rating: foundShowtime.Movie.movie_age_rating,
                image_url: foundShowtime.Movie.movie_image_url
            },
            room: {
                room_id: foundShowtime.Room.id,
                room_name: foundShowtime.Room.room_name
            },
            discount_id: discount_id ? discount_id : null,
            show_date: foundShowtime.show_date,
            start_time: foundShowtime.start_time,
            end_time: foundShowtime.end_time,
        }

        return {
            checkoutPrice,
            user_order,
            showtime,
            snacks_order_detail
        }
    }

    static async createBooking({ 
        newBooking,
        email, 
        checkoutPrice,
        showtime,
        user_order
    }) { 
        if(!checkoutPrice) throw new NotFoundError("checkout price not exists!!");

        let totalPoint = 0;
    
        const result = await db.sequelize.transaction(async (t) => {
            console.log("newBooking", newBooking);
            if(!newBooking) throw new BadRequestError("save new booking error")

            await newBooking.update(
                {booking_status: 'confirmed'}, 
                { transaction: t }
            )
            
            for (let i = 0; i < user_order.length; i++) {
                totalPoint += 10;
                let newBookingSeat = await db.booking_seat.create({
                    booking_id: newBooking.id,
                    seat_id: user_order[i].seat_id
                }, { transaction: t });
                if(!newBookingSeat) throw new BadRequestError("new booking seat error")
    
                //update status seat 
                const seat_status = "booked"
                await updateStatusSeat({
                    seatId: user_order[i].seat_id, 
                    seat_status,
                    showtime_id: showtime.show_time_id,
                    t
                });

                await releaseLock({seatId: user_order[i].seat_id})
            }

            // increase point user 
            const updatePointUser = await db.User.increment(
                { usr_point: totalPoint },
                { 
                    where: { id: newBooking.booking_userId },
                    transaction: t
                }
            );
            if(!updatePointUser) throw new BadRequestError("update point user error!!");

            if (totalPoint >= 20) {
                try {
                    await assignDiscountToUser(
                        "29352d04-ad7f-4ad3-b283-3dd2d4d56ea3",
                        newBooking.booking_userId
                    );
                } catch (err) {
                    throw new BadRequestError("Assign discount to user error!!");
                }
            }
            // send mail 
            // send mail to user booking success
            const message = {
                email: email,
                booking_id: newBooking.id,
                movie_title: showtime.movie.movie_title,
                age_rating: showtime.movie.age_rating,
                room_name: showtime.room.room_name,
                show_date: showtime.show_date,
                start_time: showtime.start_time,
                seat_number: user_order.length,
                booking: [
                    ...user_order.map(item => {
                        return {
                            seat: item.location,
                            quantity: item.quantity,
                            price: item.price,
                            stt: item.stt,
                        }
                    })
                ],
                total_price: newBooking.booking_total_checkout
            }
    
            console.log("message", message);
            const nameQueue = "email_queue"
            const exchange = "email_exchange"
            const routingkey = "booking.success"
            await producerSendToExchange({
                message: message,
                nameQueue,
                exchange,
                routingkey
            })
            
            const messageNoti = {
                pattern: 'noti_created',
                data: {
                    noti_type: "BOOKING",
                    noti_content: "Bạn đã mua vé thành công",
                    noti_options: {
                        id: newBooking.id,
                        title: showtime.movie.movie_title,
                    },
                    noti_senderId: null,
                    noti_receivedId: newBooking.booking_userId
                }
            }
            const nameQueueNoti = 'noti_queue'
            const exchangeNoti = 'noti_exchange'
            const routingkeyNoti = 'noti_created'
            await producerSendToExchange({
                message: messageNoti,
                nameQueue: nameQueueNoti,
                exchange: exchangeNoti,
                routingkey: routingkeyNoti
            })

            return newBooking
        });
        
        return result;
    }

    static async getBookingById( bookingId ) {
        const foundbooking = await foundBookingById(bookingId);
        if(!foundbooking) throw new BadRequestError("Booking not exitst!!");

        return foundbooking;
    }

    static async getBooking({ limit = 30, sort = 'ctime', page = 1 }) {
        console.log("{ limit = 30, sort = 'ctime', page = 1 }", { limit, sort, page })
        const foudAllBookings = await foundAllBooking({ limit, sort, page, 
            unselect: ['createdAt', 'updatedAt'] 
        });

        return foudAllBookings;
    }

    static async destroyReservation( reservationId ) {}

    static async getBookingByUserId( userId, { limit = 30, sort = 'ctime', page = 1 }) {
        console.log("userId kk", userId)
        const foundbooking = await foundBookingByUserId(userId, { limit, sort, page });
        if(!foundbooking) throw new BadRequestError("Booking not exitst!!");

        return foundbooking;
    }
    
}

function getSnackDetail(snack_id) {
    return new Promise((resolve, reject) => {
        snackClient.GetDetailSnack({ id: snack_id }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

function assignDiscountToUser(discount_id, user_id) {
    return new Promise((resolve, reject) => {
        discountClient.AssignDiscountToUser({ discount_id, user_id }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}


module.exports = BookingService