'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OauthUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OauthUser.init({
    oauth_fullname: DataTypes.STRING,
    oauth_dateOfBirth: DataTypes.DATE,
    oauth_sex: DataTypes.STRING,
    oauth_email: DataTypes.STRING,
    oauth_address: DataTypes.STRING,
    oauth_avatarUrl: DataTypes.STRING,
    oauth_role: DataTypes.ARRAY(DataTypes.STRING),
    oauth_type: DataTypes.STRING,
    oauth_token: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'OauthUser',
  });
  return OauthUser;
};