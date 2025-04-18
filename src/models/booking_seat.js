'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class booking_seat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      booking_seat.belongsTo(models.Booking, { foreignKey: 'booking_id' });
      booking_seat.belongsTo(models.Seat, { foreignKey: 'seat_id' });
    }
  }
  booking_seat.init({
    booking_id: DataTypes.UUID,
    seat_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'booking_seat',
  });
  return booking_seat;
};