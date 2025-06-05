const { SuccessResponse } = require("../core/success.response");
const { checkStatusPayment, paymentProcessInput, paymentProcessCallback } = require("../services/payment.service");

class PaymentController{

    paymentGenUrl = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'payment gen url success',
            metadata: await paymentProcessInput({ userId: req.userId, email: req.email, payload: req.body }) 
        }).send(res);
    }

    paymentCallback = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'payment callback success',
            metadata: await paymentProcessCallback(req.body) 
        }).send(res);
    }

    checkStatusTransaction = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'check status transaction success',
            metadata: await checkStatusPayment(req.body) 
        }).send(res);
    }
}

module.exports = new PaymentController();