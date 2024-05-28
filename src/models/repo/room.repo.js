const db = require('..');

const foundRoomById = async ( roomId ) => {
    const foundRoom = await db.Room.findOne({
        where: {id: roomId}
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

module.exports = {
    foundRoomById,
    foundAllRoom
}