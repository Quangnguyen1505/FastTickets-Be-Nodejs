const express = require('express');
const UsersController = require('../../controllers/users.controller');
const router = express.Router();
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const { uploadDisk } = require('../../config/multer.config');

router.use(authencationV2);
router.get("/profile", handlerError(UsersController.getProfile));
router.put("", uploadDisk.single('file'), handlerError(UsersController.updateUser));
router.put("/change-password", handlerError(UsersController.changePassword));

//admin
router.put("/:id", uploadDisk.single('file'), handlerError(UsersController.updateAdminUser));
router.get("", handlerError(UsersController.getUsers));
router.delete("/:id", handlerError(UsersController.deleteUser));
router.post("", handlerError(UsersController.addUser));

module.exports = router;    