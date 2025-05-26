const { SuccessResponse } = require("../core/success.response");
const { notificationClient } = require("../grpc/client/init.client");

class NotificationsController {
    async getNotis(req, res, next) {
        notificationClient.GetAllNotifications({}, (err, notifications) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: err.message });
            }
            new SuccessResponse({
                message: 'Get all notifications successfully',
                metadata: notifications
            }).send(res);
        });
    }

    async getNotiByUserId(req, res, next) {
        const { user_id } = req.params;
        notificationClient.GetNotifications({ userId: user_id }, (err, noti) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: err.message });
            }
            new SuccessResponse({
                message: 'Get notification by user ID successfully',
                metadata: noti
            }).send(res);
        });
    }     

    async createNoti(req, res, next) {
        console.log("req.body", req.body);

        const grpcPayload = {
          noti_type: req.body.noti_type,
          noti_content: req.body.noti_content,
          noti_senderId: req.userId || null,
          noti_receivedId: req.body.user_id || null,
          noti_options: req.body.noti_options,
        };

        console.log("grpcPayload", grpcPayload);

        notificationClient.CreateNotification(grpcPayload, (err, noti) => {
          if (err) {
            console.error('gRPC Error:', err);
            return res.status(500).json({
              status: 'error',
              message: err.message,
              stack: err.stack,
            });
          }
      
          new SuccessResponse({
            message: 'create notification success',
            metadata: noti
          }).send(res);
        });
    }

    async deleteNoti(req, res, next) {
        const { noti_id } = req.params;
        notificationClient.DeleteNotification({ id: noti_id }, (err, noti) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: err.message });
            }
            new SuccessResponse({
                message: 'Delete notification successfully',
                metadata: noti
            }).send(res);
        });
    }
}

module.exports = new NotificationsController();    
