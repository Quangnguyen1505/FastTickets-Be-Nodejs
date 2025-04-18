const { SuccessResponse } = require("../core/success.response");
const categoryService = require("../services/category.service");

class CategoryController {
    createCategory = async (req, res, next) => {
        new SuccessResponse({
            message: "create category success",
            metadata: await categoryService.createCategory(req.body)
        }).send(res);
    }

    getCategoryById = async (req, res, next) => {
        new SuccessResponse({
            message: "get category by Id success",
            metadata: await categoryService.getCategoryById(req.params.id)
        }).send(res);
    }

    getCategories = async (req, res, next) => {
        new SuccessResponse({
            message: "get all category success",
            metadata: await categoryService.getCategories(req.query)
        }).send(res);
    }

    updateCategories = async (req, res, next) => {
        new SuccessResponse({
            message: "update category success",
            metadata: await categoryService.updateCategory(req.params.id, req.body)
        }).send(res);
    }

    deleteCategories = async (req, res, next) => {
        new SuccessResponse({
            message: "delete category success",
            metadata: await categoryService.deleteCategory(req.params.id)
        }).send(res);
    }
}

module.exports = new CategoryController();