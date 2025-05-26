const { BadRequestError } = require("../core/error.response");
const db = require('../models');
const { foundRoomById } = require("../models/repo/room.repo");
const { findSeatById } = require("../models/repo/seat.repo");

class SeatService {
    static async createSeat(payload, t){
        if(!payload) throw new BadRequestError('Payload not exitst!!');
        const {
            seat_row, seat_type_id, seat_number, seat_roomId
        } = payload;
        
        const hasRoom = await foundRoomById({roomId: seat_roomId, t});
        if (!hasRoom) throw new BadRequestError('Room not found');

        const newSeat = await db.Seat.create({
            seat_row, seat_type_id, seat_number, seat_roomId
        }, {transaction: t});
        if(!newSeat) throw new BadRequestError("create failed!!");

        return newSeat;
    }

    static async findSeatById(seatId){
        if(!seatId) throw new BadRequestError("Seat not exitst!!");

        const foundSeat = await findSeatById(seatId);
        if(!foundSeat) throw new BadRequestError('Seat not exists!!');

        return foundSeat;
    }

    static async findAllSeat({ limit = 100, sort = 'seat_row', page = 1, room_id = null, showtime_id = null }) {
        const validSortColumns = ['seat_row', 'seat_number', 'seat_type']; 
        const orderBy = validSortColumns.includes(sort) ? [sort, 'ASC'] : ['seat_row', 'ASC'];
    
        const offset = (page - 1) * limit;
    
        const foundAll = await db.Seat.findAll({
            where: {
                seat_roomId: room_id
            },
            limit: limit,
            offset: offset,
            order: [orderBy],
            include: [
                {
                    model: db.Seat_type,
                    as: 'Seat_type', 
                    attributes: ['name']
                },
                {
                    model: db.seat_status,
                    as: 'seat_statuses',
                    required: false,
                    where: {
                        showtime_id: showtime_id
                    },
                    attributes: ['status']
                }
        ],
            attributes: { exclude: ['createdAt', 'updatedAt'] }, 
        });

        if (!foundAll.length) throw new BadRequestError('Seat not exist');

        return foundAll;
    }
    
    static async updateStatusSeat({seatId, seat_status, showtime_id, t = null}) {
        console.log("pay load", seatId, " ", seat_status)
        const foundSeat = await findSeatById({seatId, t});
        if (!foundSeat) throw new BadRequestError('Seat not exists!!');

        const [affectedRows] = await db.seat_status.update(
            { status: seat_status },
            { 
                where: { seat_id: seatId, showtime_id: showtime_id },
                transaction: t
            }
        );  
        
        if (affectedRows === 0) throw new BadRequestError('Update failed!!');

        return affectedRows;
    }
    
}


module.exports = SeatService;