'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.hasMany(models.Room_seat_type, { foreignKey: 'room_id' });
      Room.hasMany(models.Booking, { foreignKey: 'booking_roomId' });
      Room.hasMany(models.Showtime, { foreignKey: 'room_id' });
    }
  }
  Room.init({
    room_name: DataTypes.STRING,
    room_seat_quantity: DataTypes.INTEGER,
    room_status: DataTypes.BOOLEAN,
    room_release_date: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};