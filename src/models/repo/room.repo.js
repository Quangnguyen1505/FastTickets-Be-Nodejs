const db = require('..');

const foundRoomById = async ({roomId, t = null}) => {
    const foundRoom = await db.Room.findOne({
        where: {id: roomId},
        include: [{
            model: db.Room_seat_type,
            as: 'Room_seat_types', 
            attributes: ['seat_type_id'],
            include: [
                {
                    model: db.Seat_type,
                    as: 'Seat_type',
                    attributes: ['name'] 
                }
            ]
        }, {
            
            model: db.Seat,
            as: 'Seats',
            attributes: ['seat_row', 'seat_number', 'seat_status'] 
        }],
        transaction: t
    });

    return foundRoom;
}

const foundAllRoom = async ({ limit, sort, page, unselect }) => {
    const skip = ( page - 1 ) * limit;
    const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1};
    const foundRoom = await db.Room.findAll({
        attributes: {exclude: unselect},
        limit,
        sort: sortBy,
        skip,
        include: [{
            model: db.Room_seat_type,
            as: 'Room_seat_types', 
            attributes: ['seat_type_id'],
            include: [
                {
                    model: db.Seat_type,
                    as: 'Seat_type',
                    attributes: ['name'] 
                }
            ]
        }],
    });

    return foundRoom;
}

const updateMovieToRoom = async ( roomId, movieId, dateMovieNow, movieUsed, room_price ) => {
    const newRoom = await db.Room.update({
        room_currently_showing: movieId,
        room_previously_shown: movieUsed,
        room_release_date: dateMovieNow,
        room_price_currently_showing: room_price
    }, {
        where: {id: roomId}
    });

    return newRoom;
}

module.exports = {
    foundRoomById,
    foundAllRoom,
    updateMovieToRoom
}