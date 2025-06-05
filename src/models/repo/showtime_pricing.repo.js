const db = require('../../models');

const findShowTimePricingById = (show_time_pricing_id) => {
    return db.showtime_pricing.findOne({
        where: { id: show_time_pricing_id }
    })
}

module.exports = {
    findShowTimePricingById
}