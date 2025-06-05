const express = require('express');
const AccessController = require('../../controllers/access.controller');
const router = express.Router();
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const { checkAdmin } = require('../../middlewares/cache/checkAdmin.midlewares');

router.post("/register", handlerError(AccessController.signUp));
router.post("/login", handlerError(AccessController.login));
router.post("/forgotpassword", handlerError(AccessController.forgotPassword));
router.post("/reset-password", handlerError(AccessController.resetPassword));

router.use(authencationV2);
router.get("/logout", handlerError(AccessController.logout));
router.get("/verify", checkAdmin, handlerError(AccessController.verifyToken));

module.exports = router;