const db = require('..');

const foundRoomById = async ( roomId ) => {
    const foundRoom = await db.Room.findOne({
        where: {id: roomId},
        include: [{
            model: db.Movie,
            as: 'Movie', 
            attributes: ['title', 'movie_status']
        }],
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
        skip
    });

    return foundRoom;
}

const updateMovieToRoom = async ( roomId, movieId, dateMovieNow, movieUsed ) => {
    const newRoom = await db.Room.update({
        room_currently_showing: movieId,
        room_previously_shown: movieUsed,
        room_release_date: dateMovieNow
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