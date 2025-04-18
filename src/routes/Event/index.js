const express = require('express');
const eventController = require('../../controllers/event.controller');
const router = express.Router();
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.get("/:id", handlerError(eventController.getEventById));
router.get("", handlerError(eventController.getAllEvent));

router.use(authencationV2);

router.post("", handlerError(eventController.createEvent));

module.exports = router;