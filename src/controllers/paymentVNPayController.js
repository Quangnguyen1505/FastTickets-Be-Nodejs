const { SuccessResponse } = require('../core/success.response')
const PaymentVNPayService = require('../services/payment-vnpay.service')

class PayMentVNPayController {
    paymenGenurl = async (req, res, next) => {
        new SuccessResponse({
            message: 'create url successfully',
            metadata: await PaymentVNPayService.getPaymentUrl({ userId: req.userId, email: req.email, payload: req.body }),
        }).send(res)
    }

    paymentCallback = async (req, res, next) => {
        new SuccessResponse({
            message: 'payment callback successfully',
            metadata: await PaymentVNPayService.handleReturnUrl(req.body),
        }).send(res)
    }
}

module.exports = new PayMentVNPayController();