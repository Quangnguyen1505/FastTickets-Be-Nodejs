const express = require('express');
const roomController = require('../../controllers/room.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.get("/findAll", handlerError(roomController.getAllRoom));
router.get("/findOne/:roomId", handlerError(roomController.getRoomById));

router.use(authencationV2);

router.post("/create", handlerError(roomController.createRoom));
router.post("/insert/movie", handlerError(roomController.insertMovieToRoom));
// router.post("/update", handlerError(MovieController.updateMovie));

module.exports = router;