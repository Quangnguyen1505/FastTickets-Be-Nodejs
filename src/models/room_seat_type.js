'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room_seat_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room_seat_type.belongsTo(models.Room, { foreignKey: 'room_id' });
      Room_seat_type.belongsTo(models.Seat_type, { foreignKey: 'seat_type_id' });
    }
  }
  Room_seat_type.init({
    room_id: DataTypes.UUID,
    seat_type_id: DataTypes.UUID,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Room_seat_type',
  });
  return Room_seat_type;
};