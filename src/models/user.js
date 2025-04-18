'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Định nghĩa các mối quan hệ ở đây
      User.hasMany(models.keyToken, { foreignKey: 'user_id' });
      // User.hasMany(models.Event, { foreignKey: 'userId' });
      User.belongsTo(models.Role, { foreignKey: 'usr_role_id' });
      User.hasMany(models.Booking, { foreignKey: 'booking_userId' });
    }
  }
  User.init({
    usr_slug: DataTypes.STRING,
    usr_first_name: DataTypes.STRING,
    usr_last_name: DataTypes.STRING,
    usr_password: DataTypes.STRING,
    usr_salf: DataTypes.INTEGER,
    usr_email: DataTypes.STRING,
    usr_phone: DataTypes.STRING,
    usr_sex: DataTypes.INTEGER,
    usr_avatar_url: DataTypes.STRING,
    usr_date_of_birth: DataTypes.DATE,
    usr_address: DataTypes.STRING,
    usr_role_id: DataTypes.INTEGER,
    usr_status: DataTypes.ENUM("active", "block")
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};