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
      video_trailer: {
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
      movie_categoryId: {
        type: Sequelize.UUID,
        references: {
          model: 'categories',
          key: 'id'
        }
      },
      movie_status: {
        type: Sequelize.ENUM("dangchieu", "sapchieu", "dachieu"),
        defaultValue: "dangchieu"
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