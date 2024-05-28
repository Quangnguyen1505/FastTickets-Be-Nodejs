'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Movie.init({
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    content: DataTypes.STRING,
    time: DataTypes.STRING,
    director: DataTypes.STRING,
    performer: DataTypes.STRING,
    price: DataTypes.STRING,
    movie_type: DataTypes.ENUM('Hành động', 'Hài', 'Kinh dị', 'Trẻ em'),
    movie_status: DataTypes.ENUM('Đang chiếu', 'Sắp chiếu'),
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};