const db = require('../../models');

const foundBookingById = async ( bookingId ) => {
    const foundBooking = await db.Booking.findOne({
        where: {
            id: bookingId
        },
        include: [
            {
                model: db.Room,
                as: 'Room', 
                attributes: ['id', 'room_name']
            },
            {
                model: db.Movie,
                as: 'Movie', 
                attributes: ['id', 'movie_title']
            },
            {
                model: db.User,
                as: 'User', 
                attributes: ['id', 'usr_first_name', 'usr_last_name']
            },
            {
                model: db.Showtime,
                as: 'Showtime', 
                attributes: ['id', 'show_date', 'end_time']
            },
            {
                model: db.booking_seat,
                as: 'booking_seats', 
                attributes: ['seat_id'],
                include: [
                    {
                        model: db.Seat,
                        as: 'Seat',
                        attributes: ['seat_row', 'seat_number', 'seat_status'] 
                    }
                ]
            }
        ],
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
        sort: sortBy,
        include: [
            {
                model: db.Room,
                as: 'Room', 
                attributes: ['id', 'room_name']
            },
            {
                model: db.Movie,
                as: 'Movie', 
                attributes: ['id', 'movie_title']
            },
            {
                model: db.User,
                as: 'User', 
                attributes: ['id', 'usr_first_name', 'usr_last_name']
            },
            {
                model: db.Showtime,
                as: 'Showtime', 
                attributes: ['id', 'show_date', 'end_time']
            },
            {
                model: db.booking_seat,
                as: 'booking_seats', 
                attributes: ['seat_id'],
                include: [
                    {
                        model: db.Seat,
                        as: 'Seat',
                        attributes: ['seat_row', 'seat_number', 'seat_status'] 
                    }
                ]
            }
        ],
    });

    return foundBookings;
} 

module.exports = {
    foundBookingById,
    foundAllBooking
}