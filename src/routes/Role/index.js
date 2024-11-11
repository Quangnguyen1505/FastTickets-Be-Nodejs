const roleController = require('../../controllers/role.controller');
const express = require('express');
const router = express.Router();
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.use(authencationV2)
router.post("/create", authencationV2, handlerError(roleController.newRole));
router.get("/get/:id", authencationV2, handlerError(roleController.getRoleById));

module.exports = router;