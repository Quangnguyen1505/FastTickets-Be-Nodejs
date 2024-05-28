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
    }
  }
  Room.init({
    room_name: DataTypes.STRING,
    room_seat: DataTypes.ARRAY(DataTypes.JSONB),
    room_status: DataTypes.BOOLEAN,
    room_currently_showing: DataTypes.UUID,
    room_previously_shown: DataTypes.ARRAY(DataTypes.JSON),
    room_release_date: DataTypes.DATE,
    room_show_times: DataTypes.ARRAY(DataTypes.DATE)
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};