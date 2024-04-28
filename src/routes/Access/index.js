const express = require('express');
const AccessService = require('../../controllers/access.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.post("/signUp", handlerError(AccessService.signUp));

// router.use(authencationV2);

module.exports = router