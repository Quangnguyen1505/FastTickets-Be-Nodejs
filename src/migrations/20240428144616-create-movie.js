'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.STRING
      },
      director: {
        type: Sequelize.STRING
      },
      performer: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        defaultValue: []
      },
      movie_type: {
        type: Sequelize.ENUM('Hành động', 'Hài', 'Kinh dị', 'Trẻ em'),
        defaultValue: 'Hành động'
      },
      movie_status: {
        type: Sequelize.ENUM('Đang chiếu', 'Sắp chiếu'),
        defaultValue: 'Sắp chiếu'
      },
      country: {
        type: Sequelize.STRING
      },
      movie_cinemaId_playing: {
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
    await queryInterface.dropTable('Movies');
  }
};