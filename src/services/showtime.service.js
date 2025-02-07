const { BadRequestError } = require('../core/error.response');
const db = require('../models');
const { foundMovieById } = require('../models/repo/movie.repo');
const { foundRoomById } = require('../models/repo/room.repo');
const { findShowTimeByTime, findShowTimeById } = require('../models/repo/showtime.repo');

class ShowTimeService {
    static async createShowTime(payload) {
        const { start_time, movie_id, room_id } = payload

        const hasMovie = await foundMovieById(movie_id);
        if (!hasMovie) throw new BadRequestError('Movie not found');

        const hasRoom = await foundRoomById(room_id);
        if (!hasRoom) throw new BadRequestError('Room not found');

        const hasShowTime = await findShowTimeByTime(start_time);
        if (hasShowTime) throw new BadRequestError('Showtime already exists');

        const newShowTime = await db.Showtime.create({
            start_time,
            movie_id,
            room_id
        });

        return newShowTime;
    }
    static async getShowTimeByMovieId() {}
    static async getShowTimeByRoomId() {}
    static async deleteShowTime(showtime_id) {
        const foundShowTime = await findShowTimeById(showtime_id);
        if (!foundShowTime) throw new BadRequestError('Showtime not found');

        const deleteShowTime = await db.Showtime.destroy({ where: { id: showtime_id } });
        if (!deleteShowTime) throw new BadRequestError('Delete failed');

        return deleteShowTime;
    }
    static async updateShowTime() {}
}

module.exports = ShowTimeService;