const db = require('../../models');

const SeatPrice = async ( movie, user_order ) => {
    console.log("user_order", user_order);
    const movie_Price = await movie.price.map(item => item.price_seat);
    return user_order.map( item => {
        return movie_Price.includes(item.price);
    });
}

const foundReservationById = async ( reservationId ) => {
    const foundReservation = await db.Reservation.findOne({
        where: {
            id: reservationId
        }
    })

    return foundReservation
}

const foundAllReser = async ({ limit, sort, page, unselect }) => {
    const skip = ( page - 1 ) * limit;
    const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1};
    const foundReservations = await db.Reservation.findAll({
        attributes: {exclude: unselect},
        limit,
        skip,
        sort: sortBy
    });

    return foundReservations;
} 

module.exports = {
    SeatPrice,
    foundReservationById,
    foundAllReser
}