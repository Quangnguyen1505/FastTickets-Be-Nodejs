'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Showtime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Showtime.hasMany(models.showtime_pricing, { foreignKey: 'show_time_id' });
      Showtime.belongsTo(models.Movie, { foreignKey: 'movie_id' });
      Showtime.hasMany(models.Booking, { foreignKey: 'booking_show_time_id' });
      Showtime.belongsTo(models.Room, { foreignKey: 'room_id' });
    }
  }
  Showtime.init({
    show_date: DataTypes.DATE,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    movie_id: DataTypes.UUID,
    room_id: DataTypes.UUID,
    status: DataTypes.ENUM('active', 'block')
  }, {
    sequelize,
    modelName: 'Showtime',
  });
  return Showtime;
};