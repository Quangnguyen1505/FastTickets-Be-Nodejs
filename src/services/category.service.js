const db = require("../models");
var slugify = require('slugify')

class CategoryService {
    static async createCategory( payload ) {
        const { cate_name, cate_description } = payload;
        const cate_slug = slugify(cate_name);
        const newCategory = await db.category.create({ cate_name, cate_slug, cate_description });

        if(!newCategory) throw new BadRequestError("create Category error");

        return newCategory;
    }

    static async getCategoryById( categoryId ) {
        const foundCate = await db.category.findOne({
            where: { id: categoryId }
        });

        return foundCate;
    }

    static async getCategories({ limit = 30, sort = 'ctime', page = 1 }) {
        const skip = ( page - 1 ) * limit;
        const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1};
        return await db.category.findAll({
            limit,
            sort: sortBy,
            skip
        });
    }
}

module.exports = CategoryService