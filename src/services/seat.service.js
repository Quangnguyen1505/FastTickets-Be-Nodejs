const { BadRequestError } = require("../core/error.response");
const db = require('../models');
const { findSeatById, findAllSeat } = require("../models/repo/seat.repo");

class SeatService {
    static async createSeat(payload){
        if(!payload) throw new BadRequestError('Payload not exitst!!');
        const {
            roomId, seats
        } = payload;
        
        const newSeat = await db.Seat.create({
            id: roomId, seat_normal: seats[0], seat_vip: seats[1], seat_couple: seats[2]
        });
        if(!newSeat) throw new BadRequestError("create failed!!");

        return newSeat;
    }

    static async findSeatById(seatId){
        if(!seatId) throw new BadRequestError("Seat not exitst!!");

        const foundSeat = await findSeatById(seatId);
        if(!foundSeat) throw new BadRequestError('Seat not exists!!');

        return foundSeat;
    }

    static async findAllSeat({ limit = 30, sort = 'ctime', page = 1 }){
        const foundAll = await findAllSeat({limit, sort, page, unselect: ['createdAt', 'updatedAt'] });
        if(!foundAll.length) throw new BadRequestError('Seat not exitst');

        return foundAll;
    }
}


module.exports = SeatService;