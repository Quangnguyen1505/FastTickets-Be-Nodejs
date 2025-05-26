'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class seat_status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      seat_status.belongsTo(models.Seat, { foreignKey: 'seat_id' });
      seat_status.belongsTo(models.Showtime, { foreignKey: 'showtime_id' });
    }
  }
  seat_status.init({
    seat_id: DataTypes.UUID,
    showtime_id: DataTypes.UUID,
    status: DataTypes.ENUM('available', 'booked', 'reserved', 'unavailable'),
  }, {
    sequelize,
    modelName: 'seat_status',
  });
  return seat_status;
};