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
      movie_title: {
        type: Sequelize.STRING
      },
      movie_image_url: {
        type: Sequelize.STRING
      },
      movie_video_trailer_code: {
        type: Sequelize.STRING
      },
      movie_content: {
        type: Sequelize.TEXT
      },
      movie_time: {
        type: Sequelize.INTEGER
      },
      movie_director: {
        type: Sequelize.STRING
      },
      movie_performer: {
        type: Sequelize.STRING
      },
      movie_price: {
        type: Sequelize.INTEGER
      },
      movie_status: {
        type: Sequelize.ENUM("now-showing", "upcoming-movies", "past-movies"),
        defaultValue: "upcoming-movies"
      },
      movie_country: {
        type: Sequelize.STRING
      },
      movie_age_rating: {
        type: Sequelize.ENUM("K", "T13", "T16", "T18")
      },
      movie_release_date: {
        type: Sequelize.DATEONLY
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
    await queryInterface.addIndex('Movies', ['movie_title']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Movies');
  }
};