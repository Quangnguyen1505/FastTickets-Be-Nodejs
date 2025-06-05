const express = require('express');
const router = express.Router();
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const paymentController = require('../../controllers/payment.controller');

router.post("", authencationV2, handlerError(paymentController.paymentGenUrl));
router.post("/callback", handlerError(paymentController.paymentCallback));
router.post("/check-status-transaction", handlerError(paymentController.checkStatusTransaction));

module.exports = router;