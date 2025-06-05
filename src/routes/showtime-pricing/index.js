const express = require('express');
const router = express.Router();
const showtimePricingController = require('../../controllers/showtime-pricing.controller');
const { handlerError } = require('../../helper/asyncHandler');
router.get(':/showtime_pricing_id', handlerError(showtimePricingController.getShowtimePricing));

module.exports = router
