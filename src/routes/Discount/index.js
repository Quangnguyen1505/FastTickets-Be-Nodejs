const express = require('express');
const router = express.Router();
const discountController = require('../../controllers/discount.controller');
const { handlerError } = require('../../helper/asyncHandler');

router.get('', handlerError(discountController.getDiscounts));
router.get('/:discount_id', handlerError(discountController.getDiscountById));
router.post('', handlerError(discountController.createDiscount));
router.put('/:discount_id', handlerError(discountController.updateDiscount));
router.delete('/:discount_id', handlerError(discountController.deleteDiscount));

router.post('/:discount_id/users-claims/:user_id', handlerError(discountController.assignDiscountToUser))
router.get('/users/:user_id', handlerError(discountController.listUserDiscounts))

module.exports = router
