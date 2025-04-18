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
      Movie.hasMany(models.Showtime, { foreignKey: 'movie_id' });
      Movie.hasMany(models.movie_category, { foreignKey: 'movie_id' });
      Movie.hasMany(models.Booking, { foreignKey: 'booking_movieId' });
    }
  }
  Movie.init({
    movie_title: DataTypes.STRING,
    movie_image_url: DataTypes.STRING,
    movie_video_trailer_code: DataTypes.STRING,
    movie_content: DataTypes.TEXT,
    movie_time: DataTypes.INTEGER,
    movie_director: DataTypes.STRING,
    movie_performer: DataTypes.STRING,
    movie_price: DataTypes.INTEGER,
    movie_status: DataTypes.ENUM("now-showing", "upcoming-movies", "past-movies"),
    movie_country: DataTypes.STRING,
    movie_age_rating: DataTypes.ENUM("K", "T13", "T16", "T18"),
    movie_release_date: DataTypes.DATEONLY,
  }, {
    sequelize,
    modelName: 'Movie',
    indexes: [
      {
        unique: false,
        fields: ['movie_title']
      }
    ]
  });
  return Movie;
};