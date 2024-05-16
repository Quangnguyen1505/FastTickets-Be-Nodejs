'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reservation.init({
    user_order: DataTypes.ARRAY(DataTypes.JSON),
    movie_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    total_checkout: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};