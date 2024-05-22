const db = require('../../models');

const foundCinameById = async ( cinemaId ) => {
    const foundSeat = await db.Cinema.findOne({
        where: {id: cinemaId}
    });

    return foundSeat;
}

const foundAllCinema = async ({ limit, sort, page, unselect }) => {
    const skip = ( page - 1 ) * limit;
    const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1};
    const foundSeats = await db.Cinema.findAll({
        attributes: {exclude: unselect},
        limit,
        sort: sortBy,
        skip
    });

    return foundSeats;
}

module.exports = {
    foundCinameById,
    foundAllCinema
}