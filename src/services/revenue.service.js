const db = require('../models/index');
const { Op } = require('sequelize');

class RevenueService{     
    static async getAllRevenue(query) {
        const { from, to, groupBy } = query;

        const dateCondition = {};
        if (from && to) {
            dateCondition.createdAt = {
                [Op.between]: [from, to]
            };
        }

        const transactions = await db.Booking.findAll({
            where: dateCondition
        });

        const totalRevenue = transactions.reduce((sum, trans) => {
            return sum + (trans.booking_total_checkout || 0);
        }, 0);

        if (groupBy === 'date') {
            const revenueByDate = {};
            transactions.forEach(trans => {
                const date = trans.createdAt.toISOString().split('T')[0];
                if (!revenueByDate[date]) {
                    revenueByDate[date] = 0;
                }
                revenueByDate[date] += trans.booking_total_checkout || 0;
            });
            return revenueByDate;
        }

        return { totalRevenue };
    }

    static async getAllRevenueByEntity(query) {
        const { from, to, type } = query;
        console.log(from, to, type);
        // Build date range condition
        const dateCondition = {};
        if (from && to) {
            dateCondition.createdAt = {
                [Op.between]: [from, to]
            };
        }

        let revenue = [];
        
        switch(type) {
            case 'movie':
                revenue = await db.Booking.findAll({
                    where: dateCondition,
                    include: [
                        {
                            model: db.Movie,
                            as: 'Movie', 
                            attributes: ['id', 'movie_title']
                        }
                    ],
                    attributes: [
                        [db.sequelize.fn('SUM', db.sequelize.col('booking_total_checkout')), 'revenue'],
                        [db.sequelize.col('Movie.movie_title'), 'entity_name']
                    ],
                    group: ['Movie.id', 'Movie.movie_title']
                });
                break;

            case 'room':
                revenue = await db.Booking.findAll({
                    where: dateCondition,
                    include: [
                        {
                            model: db.Room,
                            as: 'Room', 
                            attributes: ['id', 'room_name']
                        }
                    ],
                    attributes: [
                        [db.sequelize.fn('SUM', db.sequelize.col('booking_total_checkout')), 'revenue'],
                        [db.sequelize.col('Room.room_name'), 'entity_name']
                    ],
                    group: ['Room.id', 'Room.room_name']
                });
                break;
        }

        return revenue;
    }

    static async getAllRevenueByDetail(query) {
        const { from, to, type, id, groupBy } = query;

        const dateCondition = {};
        if (from && to) {
            dateCondition.createdAt = {
                [Op.between]: [from, to]
            };
        }

        let whereCondition = { ...dateCondition };

        switch(type) {
            case 'movie':
                whereCondition['booking_movieId'] = id;
                break;
            case 'room':
                whereCondition['booking_roomId'] = id;
                break;
        }

        const bookings = await db.Booking.findAll({
            where: whereCondition,
            include: [
                {
                    model: db.Movie,    
                    as: 'Movie', 
                    attributes: ['id', 'movie_title']
                },
                {
                    model: db.Room,
                    as: 'Room', 
                    attributes: ['id', 'room_name']
                }
            ]
        });
        if (!bookings.length) return bookings;

        const entityInfo = (type === 'movie')
        ? bookings[0].Movie?.movie_title
        : bookings[0].Room?.room_name;

        if (groupBy === 'date') {
        const revenueByDate = {};
        bookings.forEach(booking => {
            const date = booking.createdAt.toISOString().split('T')[0];
            if (!revenueByDate[date]) {
                revenueByDate[date] = 0;
            }
            revenueByDate[date] += booking.booking_total_checkout || 0;
        });

        return {
            entity: entityInfo,
            entity_id: id,
            groupBy: 'date',
            revenueByDate
        };
    }

    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.booking_total_checkout || 0), 0);
    return {
            entity: entityInfo,
            entity_id: id,
            totalRevenue
        };
    }
}

module.exports = RevenueService;
