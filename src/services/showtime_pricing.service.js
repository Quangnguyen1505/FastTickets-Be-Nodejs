const { BadRequestError } = require('../core/error.response');
const db = require('../models');
const { findSeatTypeById } = require('../models/repo/seat_type.repo');
const { findShowTimeById } = require('../models/repo/showtime.repo');
const { findShowTimePricingById } = require('../models/repo/showtime_pricing.repo');

class ShowTimePricingService {
    static async createShowTimePricing({payload, t = null}) {
        console.log("payload", payload)
        const { show_time_id, seat_type_id, surcharge } = payload
        const hasShowTime = await findShowTimeById({showtime_id: show_time_id, t});
        if (!hasShowTime) throw new BadRequestError('Show time not found');

        const hasSeatType = await findSeatTypeById({seatTypeId: seat_type_id, t});
        if (!hasSeatType) throw new BadRequestError('Seat Type not found');

        const newShowTimePricing = await db.showtime_pricing.create({
            show_time_id,
            seat_type_id,
            surcharge
        }, { transaction: t });

        return newShowTimePricing;
    }
    static async getShowTimePricingById(show_time_pricing_id) {
        const showtimePricing = await findShowTimePricingById(show_time_pricing_id);
        if(!showtimePricing) {
            throw new BadRequestError("show time pricing not exists!")
        }
        return showtimePricing
    }
    static async getShowTimeByRoomId() {}
    static async deleteShowTime(showtime_id) {
        const foundShowTime = await findShowTimeById({showtime_id: showtime_id});
        if (!foundShowTime) throw new BadRequestError('Showtime not found');

        const deleteShowTime = await db.Showtime.destroy({ where: { id: showtime_id } });
        if (!deleteShowTime) throw new BadRequestError('Delete failed');

        return deleteShowTime;
    }
    static async updateShowTime() {}
}

module.exports = ShowTimePricingService;