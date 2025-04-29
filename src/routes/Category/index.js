const express = require('express');
const categoryController = require('../../controllers/category.controller');
const router = express.Router();
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const { checkAdmin } = require('../../middlewares/cache/checkAdmin.midlewares');

router.get("", handlerError(categoryController.getCategories));
router.get("/:id", handlerError(categoryController.getCategoryById));

router.use(authencationV2);
router.use(checkAdmin);

router.post("",  handlerError(categoryController.createCategory));
router.delete("/:id",  handlerError(categoryController.deleteCategories));
router.put("/:id",  handlerError(categoryController.updateCategories));

module.exports = router