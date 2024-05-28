const db = require('..');

const SeatPrice = async ( room, user_order ) => {
    const movie_Price = await room.room_seat.map(item => item.price);
    return user_order.map( item => {
        return movie_Price.includes(item.price);
    });

}

const foundBookingById = async ( bookingId ) => {
    const foundBooking = await db.Booking.findOne({
        where: {
            id: bookingId
        }
    })

    return foundBooking;
}

const foundAllBooking = async ({ limit, sort, page, unselect }) => {
    const skip = ( page - 1 ) * limit;
    const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1};
    const foundBookings = await db.Booking.findAll({
        attributes: {exclude: unselect},
        limit,
        skip,
        sort: sortBy
    });

    return foundBookings;
} 

module.exports = {
    SeatPrice,
    foundBookingById,
    foundAllBooking
}