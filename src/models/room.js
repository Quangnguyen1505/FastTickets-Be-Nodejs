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
      Room.belongsTo(models.Movie, { foreignKey: 'room_currently_showing' });
    }
  }
  Room.init({
    room_name: DataTypes.STRING,
    room_seat_quantity: DataTypes.INTEGER,
    room_seat_type: DataTypes.ARRAY(DataTypes.STRING),
    room_status: DataTypes.BOOLEAN,
    room_currently_showing: DataTypes.UUID,
    room_price_currently_showing: DataTypes.ARRAY(DataTypes.JSON),
    room_previously_shown: DataTypes.ARRAY(DataTypes.JSON),
    room_release_date: DataTypes.DATE,
    room_show_times: DataTypes.ARRAY(DataTypes.DATE)
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};