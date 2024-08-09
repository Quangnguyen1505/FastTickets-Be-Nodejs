const express = require('express');
const categoryController = require('../../controllers/category.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.get("/get/category", handlerError(categoryController.getCategoryById));
router.get("/getOne/:id", handlerError(categoryController.getCategories));

router.use(authencationV2);

router.post("/create",  handlerError(categoryController.createCategory));



module.exports = router