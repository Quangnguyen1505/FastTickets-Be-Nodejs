const express = require('express');
const AccessService = require('../../controllers/access.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.post("/signUp", handlerError(AccessService.signUp));
router.post("/login", handlerError(AccessService.login));

router.use(authencationV2);
router.get("/profile", handlerError(AccessService.getProfile));
router.post("/logout", handlerError(AccessService.logout));
router.post("/update", handlerError(AccessService.updateUser));

module.exports = router