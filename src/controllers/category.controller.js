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
}

module.exports = new CategoryController();