'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      category.hasMany(models.movie_category, { foreignKey: 'cate_id' })
    }
  }
  category.init({
    cate_name: DataTypes.STRING,
    cate_slug: DataTypes.STRING,
    cate_description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'category',
  });
  return category;
};