const db = require('../../models');

const findSeatById = (seatId) => {
    return db.Seat.findOne({
        where: { id: seatId },
        include: [{
            model: db.Seat_type,
            as: 'Seat_type', 
            attributes: ['name']
        }],
    })
}

const findSeatByCode = async (seatCode, seat_status) => {
    // Tách row (chữ cái) và number (số)
    const match = seatCode.match(/^([A-Za-z]+)(\d+)$/);
    if (!match) throw new Error("Invalid seat code format");
  
    const seat_row = match[1].toUpperCase(); // Chuyển về in hoa nếu cần
    const seat_number = parseInt(match[2], 10);
  
    // Tìm trong DB
    return await db.Seat.findOne({
      where: {
        seat_row,
        seat_number,
        seat_status
      }
    });
};

const findAllSeat = ({limit, page, sort, unselect}) => {
    const skip = ( page - 1 ) * limit;
    const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1};
    return db.Seat.findAll({
        attributes: {exclude: unselect},
        limit,
        sort: sortBy,
        skip,
        include: [{
            model: db.Seat_type,
            as: 'Seat_type', 
            attributes: ['name']
        }],
    });
}

module.exports = {
    findSeatById,
    findAllSeat,
    findSeatByCode
}