'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class showtime_pricing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      showtime_pricing.belongsTo(models.Showtime, { foreignKey: 'show_time_id' });
      showtime_pricing.belongsTo(models.Seat_type, { foreignKey: 'seat_type_id' });
    }
  }
  showtime_pricing.init({
    show_time_id: DataTypes.UUID,
    seat_type_id: DataTypes.UUID,
    surcharge: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'showtime_pricing',
  });
  return showtime_pricing;
};