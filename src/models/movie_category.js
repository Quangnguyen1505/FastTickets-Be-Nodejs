'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class movie_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      movie_category.belongsTo(models.Movie, { foreignKey: 'movie_id' });
      movie_category.belongsTo(models.category, { foreignKey: 'cate_id' });
    }
  }
  movie_category.init({
    cate_id: DataTypes.UUID,
    movie_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'movie_category',
  });
  return movie_category;
};