'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()")
      },
      usr_first_name: {
        type: Sequelize.STRING
      },
      usr_last_name: {
        type: Sequelize.STRING
      },
      usr_avatar_url: {
        type: Sequelize.STRING
      },
      usr_email: {
        type: Sequelize.STRING
      },
      usr_slug: {
        type: Sequelize.STRING
      },
      usr_phone: {
        type: Sequelize.STRING
      },
      usr_date_of_birth: {
        type: Sequelize.DATE
      },
      usr_password: {
        type: Sequelize.STRING
      },
      usr_salf: {
        type: Sequelize.INTEGER
      },
      usr_sex: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      usr_address: {
        type: Sequelize.STRING
      },
      user_oauth_provider: {
        type: Sequelize.ENUM('google', 'facebook'),
        allowNull: true,
      },
      user_oauth_provider_id: {
        type: Sequelize.STRING
      },
      usr_status: {
        type: Sequelize.ENUM("active", "block"),
        defaultValue: 'active'
      },
      usr_reset_password_token: {
        type: Sequelize.TEXT, 
        allowNull: true
      },
      usr_reset_password_expires: {
        type: Sequelize.BIGINT, 
        allowNull: true
      },
      usr_role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Roles',
          key: 'id'
        }
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
    await queryInterface.dropTable('Users');
  }
};