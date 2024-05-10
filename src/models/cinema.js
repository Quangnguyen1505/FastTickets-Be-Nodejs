'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cinema extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cinema.init({
    cinema_name: DataTypes.STRING,
    cinema_seat: DataTypes.ARRAY(DataTypes.JSON),
    status: DataTypes.STRING,
    movie_playing: DataTypes.ARRAY(DataTypes.INTEGER)
  }, {
    sequelize,
    modelName: 'Cinema',
  });
  return Cinema;
};