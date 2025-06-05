const express = require('express');
const router = express.Router();
const revenueController = require('../../controllers/revenue.controller');
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const { checkAdmin } = require('../../middlewares/cache/checkAdmin.midlewares');

router.use(authencationV2);
router.use(checkAdmin);
router.get('/summary', handlerError(revenueController.getAllRevenue));
router.get('/by-entity', handlerError(revenueController.getAllRevenueByEntity));
router.get('/detail', handlerError(revenueController.getAllRevenueByDetail));
module.exports = router
