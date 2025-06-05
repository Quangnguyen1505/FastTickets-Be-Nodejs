const { where, Op } = require('sequelize');
const db = require('../../models');

const findConflicTime = async ({room_id, show_date, start_time, end_time, t = null}) => {
    const overlappingShowTime = await db.Showtime.findOne({
        where: {
            room_id: room_id,
            show_date: show_date,
            [Op.or]: [
                { start_time: { [Op.between]: [start_time, end_time] } },
                { end_time: { [Op.between]: [start_time, end_time] } },
                { start_time: { [Op.lte]: start_time }, end_time: { [Op.gte]: end_time } } 
            ]
        },
        transaction: t
    });
    return overlappingShowTime
}

const findShowTimeById = async ({showtime_id, t = null}) => {
    const showtime = await db.Showtime.findOne({
        where: { id: showtime_id },
        include: [
            {
                model: db.Movie,
                as: 'Movie', 
                attributes: ['id', 'movie_title', 'movie_age_rating', 'movie_image_url']
            },
            {
                model: db.Room,
                as: 'Room', 
                attributes: ['id', 'room_name']
            }
        ],
        transaction: t
    })

    return showtime
}

const findShowTimeByMovieId = async(movie_id, { show_date = null }) => {
    const showTimes = db.Showtime.findAll({
        where: {
            movie_id,
            ...(show_date && { show_date })
        },
        include: [
            {
                model: db.Movie,
                as: 'Movie', 
                attributes: ['id', 'movie_title']
            },
            {
                model: db.Room,
                as: 'Room', 
                attributes: ['id', 'room_name']
            }
        ],
    })
    return showTimes
}

module.exports = {
    findConflicTime,
    findShowTimeById,
    findShowTimeByMovieId
}