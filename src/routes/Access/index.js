const express = require('express');
const AccessController = require('../../controllers/access.controller');
const router = express.Router();
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const { uploadDisk } = require('../../config/multer.config');

router.post("/register", handlerError(AccessController.signUp));
router.post("/login", handlerError(AccessController.login));

router.use(authencationV2);
router.get("/logout", handlerError(AccessController.logout));

module.exports = router;