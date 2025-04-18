const { SuccessResponse } = require("../core/success.response");
const ShowTimePricingService = require("../services/showtime_pricing.service");

class ShowTimePricingController {
    async getShowtimePricing(req, res, next) {
        new SuccessResponse({
            message: 'Get show time pricing success',
            metadata: await ShowTimePricingService.getShowTimePricingById(req.params.showtime_pricing_id)
        }).send(res);
    }
}

module.exports = new ShowTimePricingController();