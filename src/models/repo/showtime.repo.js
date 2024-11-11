const { where } = require('sequelize');
const db = require('../../models');

const findShowTimeByTime = async (start_time) => {
    const showtime = await db.Showtime.findOne({
        where: { start_time }
    })

    return showtime
}

const findShowTimeById = async (showtime_id) => {
    const showtime = await db.Showtime.findOne({
        where: { id: showtime_id }
    })

    return showtime
}

module.exports = {
    findShowTimeByTime,
    findShowTimeById
}