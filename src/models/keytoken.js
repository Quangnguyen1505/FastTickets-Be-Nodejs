'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class keyToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      keyToken.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  keyToken.init({
    user_id: DataTypes.UUID,
    privateKey: DataTypes.STRING,
    publicKey: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    refreshTokensUsed: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'keyToken',
  });
  return keyToken;
};