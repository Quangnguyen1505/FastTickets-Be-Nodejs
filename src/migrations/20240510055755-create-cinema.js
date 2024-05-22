'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cinemas', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      cinema_name: {
        type: Sequelize.STRING
      },
      cinema_seat: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        defaultValue: []
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'active'
      },
      movie_playing: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
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
    await queryInterface.dropTable('Cinemas');
  }
};