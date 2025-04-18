'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seat_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Seat_type.hasMany(models.Room_seat_type, { foreignKey: 'seat_type_id' });
      Seat_type.hasMany(models.showtime_pricing, { foreignKey: 'seat_type_id' });
    }
  }
  Seat_type.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Seat_type',
  });
  return Seat_type;
};