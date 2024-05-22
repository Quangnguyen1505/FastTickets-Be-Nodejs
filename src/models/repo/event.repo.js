const db = require('../../models');

const findEventById = async ( eventId, unselect ) => {
    const foundEvent = await db.Event.findOne({
        where: { id: eventId },
        attributes: { exclude: unselect }
    });

    return foundEvent;
}

const findAllEvent = async ({  limit, sort, page, unselect }) => {
    const skip = ( page - 1 ) * limit;
    const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1};
    const foundSeats = await db.Event.findAll({
        attributes: {exclude: unselect},
        limit,
        sort: sortBy,
        skip
    });

    return foundSeats;
}

module.exports = {
    findEventById,
    findAllEvent
}