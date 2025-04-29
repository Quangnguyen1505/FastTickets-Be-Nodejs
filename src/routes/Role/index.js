const roleController = require('../../controllers/role.controller');
const express = require('express');
const router = express.Router();
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const { checkAdmin } = require('../../middlewares/cache/checkAdmin.midlewares');

router.use(authencationV2)
router.use(checkAdmin);
router.post("", handlerError(roleController.newRole));
router.get("/:id", handlerError(roleController.getRoleById));
router.get("", handlerError(roleController.getAllRole));
router.put("/:id", handlerError(roleController.updateRole));
router.delete("/:id", handlerError(roleController.deleteRole));

module.exports = router;