'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Movies', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
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
        type: Sequelize.STRING
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    //define index
    await queryInterface.addIndex('Movies', ['title']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Movies');
  }
};