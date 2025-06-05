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
                        attributes: ['seat_row', 'seat_number'] 
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
                attributes: ['id', 'movie_title', 'movie_image_url']
            },
            {
                model: db.User,
                as: 'User', 
                attributes: ['id', 'usr_first_name', 'usr_last_name', 'usr_email']
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
                        attributes: ['seat_row', 'seat_number'] 
                    }
                ]
            }
        ],
    });

    return foundBookings;
} 

const foundBookingByUserId = async ( userId, { limit, sort, page, unselect }) => {
    const skip = ( page - 1 ) * limit;
    const order = sort === 'ctime' ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']];
    
    const foundBooking = await db.Booking.findAll({
        where: {
            booking_userId: userId
        },
        limit,
        skip,
        order,
        include: [
            {
                model: db.Room,
                as: 'Room', 
                attributes: ['id', 'room_name']
            },
            {
                model: db.Movie,
                as: 'Movie', 
                attributes: ['id', 'movie_title', 'movie_image_url']
            },
            {
                model: db.Showtime,
                as: 'Showtime', 
                attributes: ['id', 'show_date', 'start_time']
            },
            {
                model: db.booking_seat,
                as: 'booking_seats', 
                attributes: ['seat_id'],
                include: [
                    {
                        model: db.Seat,
                        as: 'Seat',
                        attributes: ['seat_row', 'seat_number'] 
                    }
                ]
            }
        ],
    })

    return foundBooking;
}

module.exports = {
    foundBookingById,
    foundAllBooking,
    foundBookingByUserId
}