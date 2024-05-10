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
    price: DataTypes.ARRAY(DataTypes.JSON),
    movie_type: DataTypes.ENUM('Hành động', 'Hài', 'Kinh dị', 'Trẻ em'),
    movie_status: DataTypes.ENUM('Đang chiếu', 'Sắp chiếu'),
    movie_cinemaId_playing: DataTypes.ARRAY(DataTypes.INTEGER),
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};