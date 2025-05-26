'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Seat.belongsTo(models.Seat_type, { foreignKey: 'seat_type_id' });
      Seat.belongsTo(models.Room, { foreignKey: 'seat_roomId' });
      Seat.hasMany(models.booking_seat, { foreignKey: 'seat_id' }); 
      Seat.hasMany(models.seat_status, { foreignKey: 'seat_id' });
    }
  }
  Seat.init({
    seat_row: DataTypes.STRING,
    seat_number: DataTypes.INTEGER,
    seat_roomId: DataTypes.UUID,
    seat_type_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'Seat',
  });
  return Seat;
};