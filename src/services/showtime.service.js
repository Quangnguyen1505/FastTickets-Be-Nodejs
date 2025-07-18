const { BadRequestError } = require('../core/error.response');
const db = require('../models');
const { foundMovieById } = require('../models/repo/movie.repo');
const { foundRoomById } = require('../models/repo/room.repo');
const { findConflicTime, findShowTimeById, findShowTimeByMovieId } = require('../models/repo/showtime.repo');
const { createShowTimePricing } = require('./showtime_pricing.service');

class ShowTimeService {
    // surcharge_seat = [
    //     {
    //         name_type: "normal",
    //         surcharge: 20000
    //     },
    //     {
    //         name_type: "vip",
    //         surcharge: 20000
    //     },
    //     {
    //         name_type: "couple",
    //         surcharge: 20000
    //     },
    // ]
    static async createShowTime(payload) {
        console.log("payload", payload)
        const { show_date, start_time, end_time, movie_id, room_id, surcharge_seat } = payload
        
        const result = await db.sequelize.transaction(async (t) => {
            const hasMovie = await foundMovieById({movieId: movie_id, t});
            if (!hasMovie) throw new BadRequestError('Movie not found');

            const hasRoom = await foundRoomById({roomId: room_id, t});
            if (!hasRoom) throw new BadRequestError('Room not found');

            const convert_start_time = db.Sequelize.literal(`TIME '${start_time}'`);
            const convert_end_time = db.Sequelize.literal(`TIME '${end_time}'`)

            const hasShowTime = await findConflicTime({
                room_id: hasRoom.id, 
                show_date: show_date, 
                start_time: convert_start_time, 
                end_time: convert_end_time,
                t
            });
            if (hasShowTime) throw new BadRequestError('Showtime conflicts with another showtime in the same room');

            const newShowTime = await db.Showtime.create({
                show_date,
                start_time: convert_start_time,
                end_time: convert_end_time,
                movie_id,
                room_id,
            }, { transaction: t });
            if(!newShowTime) throw new BadRequestError("error create show time");
            for (let i = 0; i < surcharge_seat.length; i++) {
                if(hasRoom.Room_seat_types[i].Seat_type.name == surcharge_seat[i].name_type){
                    const newPayload = {
                        show_time_id: newShowTime.id, 
                        seat_type_id: hasRoom.Room_seat_types[i].seat_type_id, 
                        surcharge: surcharge_seat[i].surcharge
                    }
                    const newShowTimePricing = await createShowTimePricing({payload: newPayload, t})
                    console.log("5")
                    if(!newShowTimePricing) throw new BadRequestError("error create show time pricing")
                }       
            }

            // Bước thêm: Tạo Seat_status cho tất cả ghế trong phòng
            const seats = await db.Seat.findAll({
                where: { seat_roomId: room_id },
                attributes: ['id']
            });

            console.log("seats", seats)

            const seatStatuses = seats.map(seat => ({
                seat_id: seat.id,
                showtime_id: newShowTime.id,
                status: 'available'
            }));

            console.log("seatStatuses", seatStatuses)

            await db.seat_status.bulkCreate(seatStatuses, { transaction: t });
            
            return newShowTime;
        })
        
        return result;
    }
    static async getShowTimeById(showtime_id) {
        const foundShowTime = await findShowTimeById({showtime_id});
        if(!foundShowTime) throw new BadRequestError("show time not exists")
        
        return foundShowTime
    }

    static async deleteShowTime(showtime_id) {
        const foundShowTime = await findShowTimeById({ showtime_id });
        if (!foundShowTime) throw new BadRequestError('Showtime not found');

        const result = await db.sequelize.transaction(async (t) => {
            // Xoá seat_statuses trước
            await db.seat_status.destroy({
                where: { showtime_id },
                transaction: t
            });

            // Xoá showtime_pricing
            await db.showtime_pricing.destroy({
                where: { show_time_id: showtime_id },
                transaction: t
            });

            // Xoá chính Showtime
            const deleteShowTime = await db.Showtime.destroy({
                where: { id: showtime_id },
                transaction: t
            });

            if (!deleteShowTime) throw new BadRequestError('Delete failed');

            return deleteShowTime;
        });

        return result;
    }
    

    static async getTicketPrice (showtimeId, seatTypeId) {
        const showtime = await db.Showtime.findOne({
            where: { id: showtimeId },
            include: [
                {
                    model: db.Movie, 
                    attributes: ['movie_price']
                },
                {
                    model: db.showtime_pricing,
                    where: { seat_type_id: seatTypeId },
                    attributes: ['surcharge']
                }
            ]
        });
    
        if (!showtime) throw new Error("Showtime not found");
    
        const basePriceMovie = showtime.Movie?.movie_price || 0;
        const surcharge = showtime.showtime_pricings[0]?.surcharge || 0;
        return Number(basePriceMovie) + Number(surcharge);
    }
    static async updateShowTime() {}

    static async getAllShowTimeByMovieId(movie_id, { show_date = null }){
        const showtimes = await findShowTimeByMovieId(movie_id, { show_date });
        if(!showtimes) throw new BadRequestError("error get show times")
        
        return showtimes
    }

    static async getAllShowTime({ limit, sort, unselect, show_date = null }) {
        const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1};
        const foundShowTime = await db.Showtime.findAll({
            where: {
                ...(show_date && { show_date }),
            },
            attributes: {exclude: unselect},
            limit,
            sort: sortBy,
            include: [
                {
                    model: db.Movie,
                    as: 'Movie', 
                    attributes: ['movie_title']
                },
                {
                    model: db.Room,
                    as: 'Room', 
                    attributes: ['room_name']
                }
            ],
        });
    
        return foundShowTime;
    }
}

module.exports = ShowTimeService;