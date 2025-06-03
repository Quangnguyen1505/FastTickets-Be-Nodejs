const { foundMovieByName } = require("../../models/repo/movie.repo");
const { findShowTimeByMovieId } = require("../../models/repo/showtime.repo");
const { paymentProcessInput } = require("../../services/payment.service");
const { Op } = require("sequelize");
const db = require('../../models');

const createUrlPaymentMomo = async (call, callback) => {
    console.log("call.request", call.request);

    const {userId, showtime, showdate, movieTitle, seatPayload} = call.request;

    const hasMovie = await db.Movie.findOne({
      where: {
        movie_title: {
          [Op.iLike]: movieTitle
        }
      }
    });

    console.log("hasMovie", hasMovie);
    if (!hasMovie) {
        return callback({
            code: 400,
            message: 'Movie not found',
        });
    }

    const hasShowTimeByMovie = await findShowTimeByMovieId(hasMovie.id, {show_date: showdate});
    console.log("hasShowTimeByMovie", hasShowTimeByMovie);
    const matchedShowtime = hasShowTimeByMovie.find((s) => {
      const startTimeStr = typeof s.start_time === "string"
        ? s.start_time
        : s.start_time.toTimeString().slice(0, 8); // fallback nếu là Date

      return startTimeStr === showtime;
    });
    console.log("matchedShowtime", matchedShowtime);
    if (!matchedShowtime) {
      return callback({
        code: 400,
        message: 'Showtime not found for this movie on selected date/time',
      });
    }

    const converSeatPayload = seatPayload.map((seat) => ({
        type: seat.seatType,
        location: seat.seatLocation,
    }));

    console.log("converSeatPayload", converSeatPayload);

    const payload = {
        show_time_id: matchedShowtime.id,
        user_order_book: converSeatPayload,
    }

    console.log("userId, showtime, showdate, movieTitle ", userId, showtime, showdate, movieTitle);
    const res = await paymentProcessInput({userId, email:"quang@gmail.com", payload, methodChatbot: true});
    console.log("res", res);
    return callback(null, {
        urlPaymentMomo: res.payUrl,
        code: 200,
        message: 'Tạo link thanh toán thành công',
    });
}

module.exports = {
  createUrlPaymentMomo,
};
