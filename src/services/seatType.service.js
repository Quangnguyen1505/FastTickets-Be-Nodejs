const { BadRequestError } = require("../core/error.response");
const db = require('../models');
const { findSeatTypeByName, findSeatTypeById, findAllSeatType } = require("../models/repo/seat_type.repo");

class SeatTypeService {
    static async createSeatType(payload){
        if(!payload) throw new BadRequestError('Payload not exitst!!');
        const {
            name, description
        } = payload;
        
        const hasSeatType = await findSeatTypeByName({name});
        if (hasSeatType) throw new BadRequestError('seat type exitst');

        const newSeatType = await db.Seat_type.create({
            name, description
        });
        if(!newSeatType) throw new BadRequestError("create seat Type failed!!");

        return newSeatType;
    }

    static async findSeatTypeById(seatTypeId){
        if(!seatTypeId) throw new BadRequestError("Seat type not exitst!!");

        const foundSeatType = await findSeatTypeById(seatTypeId);
        if(!foundSeatType) throw new BadRequestError('Seat not exists!!');

        return foundSeatType;
    }

    static async findAllSeatType({ limit = 30, sort = 'ctime', page = 1 }){
        const foundAllSeatType = await findAllSeatType({limit, sort, page, unselect: ['createdAt', 'updatedAt'] });
        if(!foundAllSeatType.length) throw new BadRequestError('Seat type not exitst');

        return foundAllSeatType;
    }

    static async updateSeatType(seatTypeId, payload) {
        const { name, description } = payload;
        const foundSeatType = await db.Seat_type.findByPk(seatTypeId);

        if (!foundSeatType) throw new NotFoundError("Seat Type not found");

        const updated = await foundSeatType.update({
            name,
            description,
        });

        return updated;
    }

    static async deleteSeatType(seatTypeId) {
        const foundSeatType = await db.Seat_type.findByPk(seatTypeId);
        if (!foundSeatType) throw new NotFoundError("Seat Type not found");

        await foundSeatType.destroy();

        return foundSeatType;
    }
}


module.exports = SeatTypeService;