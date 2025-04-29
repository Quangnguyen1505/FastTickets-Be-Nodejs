const db = require('../../models');

const findSeatTypeByName = ({name, t = null}) => {
    return db.Seat_type.findOne({
        where: { name: name },
        transaction: t
    })
}

const findSeatTypeById = (seatTypeId) => {
    return db.Seat_type.findOne({
        where: { id: seatTypeId }
    })
}

const findAllSeatType = ({limit, page, sort, unselect}) => {
    const skip = ( page - 1 ) * limit;
    const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1};
    return db.Seat_type.findAll({
        attributes: {exclude: unselect},
        limit,
        sort: sortBy,
        skip
    });
}

module.exports = {
    findSeatTypeByName,
    findSeatTypeById,
    findAllSeatType
}