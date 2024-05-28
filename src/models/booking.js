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
    }
  }
  Booking.init({
    booking_roomId: DataTypes.UUID,
    booking_seats: DataTypes.ARRAY(DataTypes.JSONB),
    booking_movieId: DataTypes.UUID,
    booking_userId: DataTypes.UUID,
    booking_address: DataTypes.STRING,
    booking_total_checkout: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};