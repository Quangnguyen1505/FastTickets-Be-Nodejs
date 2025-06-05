const { SuccessResponse } = require("../core/success.response");
const { snackClient } = require("../grpc/client/init.client");
const UploadService = require("../services/upload.service");

class SnacksController {
    async getSnacks(req, res, next) {
        snackClient.GetAllSnacks({}, (err, snacks) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: err.message });
            }
            new SuccessResponse({
                message: 'Get all snacks successfully',
                metadata: snacks
            }).send(res);
        });
    }

    async getSnackById(req, res, next) {
        const { snack_id } = req.params;
        snackClient.GetDetailSnack({ id: snack_id }, (err, snack) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: err.message });
            }
            new SuccessResponse({
                message: 'Get snack by ID successfully',
                metadata: snack
            }).send(res);
        });
    }     

    async createSnack(req, res, next) {
        console.log("req.body", req.body);
        const filePath = req.file.path;
        if (filePath) {
            // upload file 
            const result = await UploadService.uploadImageFromLocal({ path: filePath });
            req.body.item_image_url = result.image_url;
        }

        const grpcPayload = {
          item_name: req.body.item_name,
          item_price: parseInt(req.body.item_price, 10),
          quantity_available: parseInt(req.body.quantity_available, 10),
          category: parseInt(req.body.category, 10),
          item_image_url: req.body.item_image_url || '',
        };

        snackClient.CreateSnack(grpcPayload, (err, snack) => {
          if (err) {
            console.error('gRPC Error:', err);
            return res.status(500).json({
              status: 'error',
              message: err.message,
              stack: err.stack,
            });
          }
      
          new SuccessResponse({
            message: 'create snack success',
            metadata: snack
          }).send(res);
        });
    }

    async updateSnack(req, res, next) {
      console.log("req.body", req.body);
        const { snack_id } = req.params;
        const filePath = req.file ? req.file.path : null;
        console.log("filePath", filePath);
        if (filePath) {
            // upload file 
            const result = await UploadService.uploadImageFromLocal({ path: filePath });
            req.body.item_image_url = result.image_url;
        }
        const updatePayload = {
            id: snack_id,
            item_name: req.body.item_name,
            item_price: parseInt(req.body.item_price, 10),
            quantity_available: parseInt(req.body.quantity_available, 10),
            category: parseInt(req.body.category, 10),
            item_image_url: req.body.item_image_url || '',
        };
        console.log("updatePayload", updatePayload);

        snackClient.UpdateSnack(updatePayload, (err, snack) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: err.message });
            }
            new SuccessResponse({
                message: 'Update snack successfully',
                metadata: snack
            }).send(res);
        });
    }

    async deleteSnack(req, res, next) {
        const { snack_id } = req.params;
        snackClient.RemoveSnack({ id: snack_id }, (err, snack) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: err.message });
            }
            new SuccessResponse({
                message: 'Delete snack successfully',
                metadata: snack
            }).send(res);
        });
    }
}

module.exports = new SnacksController();    
