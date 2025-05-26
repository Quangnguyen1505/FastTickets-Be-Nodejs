const { SuccessResponse } = require('../core/success.response');
const { discountClient } = require('../grpc/client/init.client');

class DiscountController {
    async getDiscounts(req, res, next) {
        discountClient.ListDiscounts({}, (err, discounts) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: err.message });
            }
            new SuccessResponse({
                message: 'Get all discounts successfully',
                metadata: discounts
            }).send(res);
        });
    }

    async getDiscountById(req, res, next) {
        const { discount_id } = req.params;
        discountClient.GetDiscount({ id: discount_id }, (err, discount) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: err.message });
            }
            new SuccessResponse({
                message: 'Get discount by ID successfully',
                metadata: discount
            }).send(res);
        });
    }     

    async createDiscount(req, res, next) {
        console.log("req.body", req.body);

        const grpcPayload = {
            discount: {
                discount_name: req.body.discount_name,
                discount_description: req.body.discount_description,
                discount_code: req.body.discount_code,
                discount_value: req.body.discount_value,
                discount_type: req.body.discount_type,
                discount_start_date: req.body.discount_start_date,
                discount_end_date: req.body.discount_end_date,
                discount_max_uses: req.body.discount_max_uses,
                discount_min_booking_amount: req.body.discount_min_booking_amount,
                discount_is_active: req.body.discount_is_active,
                movie_ids: req.body.movie_ids
            }
        };

        console.log("grpcPayload", grpcPayload);

        discountClient.CreateDiscount(grpcPayload, (err, discount) => {
          if (err) {
            console.error('gRPC Error:', err);
            return res.status(500).json({
              status: 'error',
              message: err.message,
              stack: err.stack,
            });
          }
      
          new SuccessResponse({
            message: 'create discount success',
            metadata: discount
          }).send(res);
        });
    }

    async updateDiscount(req, res, next) {
        const grpcPayload = {
            discount: {id: req.params.discount_id, ...req.body}
        };

        console.log("grpcPayload", grpcPayload);
        discountClient.UpdateDiscount(grpcPayload, (err, discounts) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: err.message });
            }
            new SuccessResponse({
                message: 'update discount by discount Id successfully',
                metadata: discounts
            }).send(res);
        });
    }

    async deleteDiscount(req, res, next) {
        const { discount_id } = req.params;
        discountClient.DeleteDiscount({ id: discount_id }, (err, discount) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: err.message });
            }
            new SuccessResponse({
                message: 'Delete discount successfully',
                metadata: discount
            }).send(res);
        });
    }

    async assignDiscountToUser(req, res, next) {
        const { discount_id, user_id } = req.params;
        discountClient.AssignDiscountToUser({ 
            discount_id: discount_id,
            user_id: user_id
        }, (err, discount) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: err.message });
            }
            new SuccessResponse({
                message: 'claims discount successfully',
                metadata: discount
            }).send(res);
        });
    }

    async listUserDiscounts(req, res, next) {
        const { user_id } = req.params;
        console.log("user_id", user_id);
        discountClient.ListUserDiscounts({ user_id }, (err, discount) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: err.message });
            }
            new SuccessResponse({
                message: 'list discount by userId successfully',
                metadata: discount
            }).send(res);
        });
    }
}

module.exports = new DiscountController();    
