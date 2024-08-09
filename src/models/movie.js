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
      Movie.hasMany(models.Room, { foreignKey: 'room_currently_showing' });
      Movie.belongsTo(models.category, { foreignKey: 'movie_categoryId' });
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
    movie_categoryId: DataTypes.UUID,
    movie_status: DataTypes.ENUM('Now Showing', 'Coming Soon', 'Previously Shown'),
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Movie',
    indexes: [
      {
        unique: false,
        fields: ['title']
      }
    ]
  });
  return Movie;
};