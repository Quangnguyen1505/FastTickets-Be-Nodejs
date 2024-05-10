const db = require('../../models');

const foundCinameById = async ( cinemaId ) => {
    const foundSeat = await db.Cinema.findOne({
        where: {id: cinemaId}
    });

    return foundSeat;
}

const foundAllCinema = async () => {
    const foundSeats = await db.Cinema.findAll();

    return foundSeats;
}

module.exports = {
    foundCinameById,
    foundAllCinema
}