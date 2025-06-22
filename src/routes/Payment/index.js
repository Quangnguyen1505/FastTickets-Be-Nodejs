const express = require('express');
const router = express.Router();
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const paymentController = require('../../controllers/payment.controller');
const PayMentVNPayController = require('../../controllers/paymentVNPayController');

router.post("", authencationV2, handlerError(paymentController.paymentGenUrl));
router.post("/callback", handlerError(paymentController.paymentCallback));
router.post("/check-status-transaction", handlerError(paymentController.checkStatusTransaction));

//vnpay
router.use(authencationV2);
router.post("/vnpay", handlerError(PayMentVNPayController.paymenGenurl));
router.post("/vnpay/update", handlerError(PayMentVNPayController.paymentCallback));

module.exports = router;
