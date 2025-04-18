const express = require('express');
const roomController = require('../../controllers/room.controller');
const router = express.Router();
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.get("", handlerError(roomController.getAllRoom));
router.get("/:roomId", handlerError(roomController.getRoomById));

router.use(authencationV2);

router.post("", handlerError(roomController.createRoom));
router.put("/:roomId", handlerError(roomController.updateRoom));
router.delete("/:roomId", handlerError(roomController.deleteRoom));

module.exports = router;