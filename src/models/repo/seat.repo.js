const db = require('../../models');

const findSeatById = ({seatId, t = null}) => {
    return db.Seat.findOne({
        where: { id: seatId },
        include: [{
            model: db.Seat_type,
            as: 'Seat_type', 
            attributes: ['name']
        }],
        transaction: t,
    })
}

// const findSeatByCode = async (seatCode, seat_status) => {
//     // Tách row (chữ cái) và number (số)
//     const match = seatCode.match(/^([A-Za-z]+)(\d+)$/);
//     if (!match) throw new Error("Invalid seat code format");
  
//     const seat_row = match[1].toUpperCase(); // Chuyển về in hoa nếu cần
//     const seat_number = parseInt(match[2], 10);
  
//     // Tìm trong DB
//     return await db.Seat.findOne({
//       where: {
//         seat_row,
//         seat_number,
//         seat_status
//       }
//     });
// };

const findSeatByCode = async (seatCode, seat_status, showtime_id) => {
    console.log("seat_status", seat_status)
    console.log("showtime_id", showtime_id)
    // Tách row (chữ cái) và number (số)
    const match = seatCode.match(/^([A-Za-z]+)(\d+)$/);
    if (!match) throw new Error("Invalid seat code format");
  
    const seat_row = match[1].toUpperCase(); // Chuyển về in hoa nếu cần
    const seat_number = parseInt(match[2], 10);

    const foundShowtime = await db.Showtime.findOne({
        where: { id: showtime_id },
        attributes: ['room_id']
    });
    if (!foundShowtime) throw new BadRequestError("Showtime not found");
  
    // Tìm trong DB
    const foundSeat = await db.Seat.findOne({
      where: {
        seat_row,
        seat_number,
        seat_roomId: foundShowtime.room_id
      }
    });

    if (!foundSeat) throw new BadRequestError("Seat not exists!!");

    const foundSeatStatus = await db.seat_status.findOne({
      where: { 
        seat_id: foundSeat.id, 
        status: seat_status, 
        showtime_id: showtime_id 
      }
    });

    return foundSeatStatus;
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