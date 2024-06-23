'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OauthUsers', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
      },
      oauth_fullname: {
        type: Sequelize.STRING
      },
      oauth_dateOfBirth: {
        type: Sequelize.DATE
      },
      oauth_sex: {
        type: Sequelize.STRING
      },
      oauth_email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      oauth_avatarUrl: {
        type: Sequelize.STRING,
        defaultValue: ''
      }, 
      oauth_role: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: ['USER']
      },
      oauth_type: {
        type: Sequelize.STRING
      },
      oauth_hash_confirm: {
        type: Sequelize.STRING
      },
      oauth_publickey: {
        type: Sequelize.STRING
      },
      oauth_token: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OauthUsers');
  }
};