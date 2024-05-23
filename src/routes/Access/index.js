const express = require('express');
const AccessController = require('../../controllers/access.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.post("/signUp", handlerError(AccessController.signUp));
router.post("/login", handlerError(AccessController.login));

router.use(authencationV2);
router.get("/profile", handlerError(AccessController.getProfile));
router.post("/logout", handlerError(AccessController.logout));
router.post("/update", handlerError(AccessController.updateUser));

module.exports = router;