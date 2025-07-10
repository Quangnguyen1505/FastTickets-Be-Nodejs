const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat} = require('vnpay')
const config = require("../config/config");
const db = require("../models");
const { checkoutReviewBooking, createBooking } = require("./booking.service");
const { findSeatByCode } = require("../models/repo/seat.repo");
const { BadRequestError } = require('../core/error.response');
const { foundBookingById } = require('../models/repo/booking.repo');
const { findShowTimeById } = require('../models/repo/showtime.repo');

class PaymentVNPayService {
    static vnpayInstance = new VNPay({
        tmnCode: config.development.paymentVnpay.tmnCode,
        secureSecret: config.development.paymentVnpay.secureSecret,
        vnpayHost: config.development.paymentVnpay.vnpayHost,
        queryDrAndRefundHost: config.development.paymentVnpay.queryDrAndRefundHost,
        testMode: true,
        hashAlgorithm: config.development.paymentVnpay.hashAlgorithm,
        enableLog: true,
        loggerFn: ignoreLogger,

        endpoints: {
            paymentEndpoint: 'paymentv2/vpcpay.html',       
            queryDrRefundEndpoint: 'merchant_webapi/api/transaction', 
            getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
        }
    });
    
    static async getPaymentUrl({ userId, email, payload }) {
        const { show_time_id, user_order_book, snacks_order, discount_id = null } = payload;

        for (let i = 0; i < user_order_book.length; i++) {
            let foundSeat = await findSeatByCode(user_order_book[i].location, "booked", show_time_id);
            if (foundSeat) throw new BadRequestError(`Seat ${user_order_book[i].location} already booked!!`);
        }

        const { checkoutPrice, showtime, user_order, discount_id: discountId } = await checkoutReviewBooking({
            show_time_id, payload: {
                user_order: user_order_book,
                snacks_order,
                discount_id
            }
        });

        const bookingextra = {
            user_order,
            discountId,
            email
        }

        const extraData = Buffer.from(JSON.stringify(bookingextra)).toString('base64');

        console.log("total checkout ", checkoutPrice)
        var amount = String(Math.round(checkoutPrice));

        const newBookingWithPending = await db.Booking.create({
            booking_roomId: showtime.room.room_id,
            booking_userId: userId,
            booking_movieId: showtime.movie.movie_id,
            booking_date: showtime.show_date,
            booking_total_checkout: checkoutPrice,
            booking_status: "pending",
            booking_show_time_id: showtime.show_time_id,
            payment_method: 'vnpay',
            payment_order_id: config.development.paymentVnpay.tmnCode + new Date().getTime(),
            payment_result_code: '',
            payment_message: '',
            payment_transaction_id: '',
        });

        console.log("newBookingWithPending", newBookingWithPending)

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        try {
            const response = await this.vnpayInstance.buildPaymentUrl({
                vnp_Amount: amount,
                vnp_IpAddr: config.development.paymentVnpay.vnp_IpAddr,
                vnp_TxnRef: newBookingWithPending.id,
                vnp_OrderInfo: `${extraData}`,
                vnp_OrderType: ProductCode.Other,
                vnp_ReturnUrl: `${config.development.url_server}/payment-success`,
                vnp_Locale: VnpLocale.VN,
                vnp_CreateDate: dateFormat(new Date()),
                vnp_ExpireDate: dateFormat(tomorrow)
            })

            console.log("response", response)

            return response;
        } catch (error) {
            console.error("Error building payment URL:", error);
            throw new BadRequestError("Không thể tạo liên kết thanh toán VNPAY");
        }
    }

    static async handleReturnUrl(payload) {
        console.log("body", payload);
        const isValid = this.vnpayInstance.verifyReturnUrl(payload);
        console.log("isValid", isValid);
        if (!isValid) {
            return { success: false, message: 'Invalid checksum' };
        }

        const responseCode = payload.vnp_ResponseCode;
        const transactionStatus = payload.vnp_TransactionStatus;

        if (responseCode === '00' && transactionStatus === '00') {
            const orderId = payload.vnp_TxnRef;
            const foundBooking = await foundBookingById(orderId);
            if (!foundBooking) {
                throw new BadRequestError(`Booking with ID ${orderId} not found`);
            }

            const foundShowtime = await findShowTimeById({ showtime_id: foundBooking.booking_show_time_id });
            if (!foundShowtime) {
                throw new BadRequestError(`Showtime with ID ${foundBooking.booking_show_time_id} not found`);
            }

            const extraDataStr = Buffer.from(payload.vnp_OrderInfo, 'base64').toString('utf-8');
            const { user_order: userOrder, discount_id: discountId, email } = JSON.parse(extraDataStr);
            console.log("extraDataStr", { userOrder, discountId });
            const showtimenew = {
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
                discount_id: discountId ? discountId : null,
                show_date: foundShowtime.show_date,
                start_time: foundShowtime.start_time,
                end_time: foundShowtime.end_time,
            }
            const newBooking = await createBooking({ 
                newBooking: foundBooking, 
                email, 
                checkoutPrice: payload.vnp_Amount, 
                showtime: showtimenew, 
                user_order: userOrder
            });

            
            return newBooking;
        }

        throw new BadRequestError(`Payment failed with response code: ${responseCode} and transaction status: ${transactionStatus}`);
    }
}

module.exports = PaymentVNPayService;