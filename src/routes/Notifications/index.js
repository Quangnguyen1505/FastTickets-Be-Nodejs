const express = require('express');
const router = express.Router();
const notificationsController = require('../../controllers/notifications.controller');
const { handlerError } = require('../../helper/asyncHandler');

router.get('', handlerError(notificationsController.getNotis));
router.get('/:user_id', handlerError(notificationsController.getNotiByUserId));
router.delete('/:noti_id', handlerError(notificationsController.deleteNoti));

module.exports = router
