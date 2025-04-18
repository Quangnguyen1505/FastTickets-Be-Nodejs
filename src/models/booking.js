'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.hasMany(models.booking_seat, { foreignKey: 'booking_id' });
      Booking.belongsTo(models.Room, { foreignKey: 'booking_roomId' });
      Booking.belongsTo(models.Movie, { foreignKey: 'booking_movieId' });
      Booking.belongsTo(models.User, { foreignKey: 'booking_userId' });
      Booking.belongsTo(models.Showtime, { foreignKey: 'booking_show_time_id' });
    }
  }
  Booking.init({
    booking_roomId: DataTypes.UUID,
    booking_movieId: DataTypes.UUID,
    booking_userId: DataTypes.UUID,
    booking_date: DataTypes.STRING,
    booking_total_checkout: DataTypes.FLOAT,
    booking_status: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    booking_show_time_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};