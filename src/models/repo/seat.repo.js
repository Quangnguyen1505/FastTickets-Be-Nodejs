const db = require('../../models');

const findSeatById = (seatId) => {
    return db.Seat.findOne({
        where: { id: seatId }
    })
}

const findAllSeat = ({limit, page, sort, unselect}) => {
    const skip = ( page - 1 ) * limit;
    const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1};
    return db.Seat.findAll({
        attributes: {exclude: unselect},
        limit,
        sort: sortBy,
        skip
    });
}

module.exports = {
    findSeatById,
    findAllSeat
}