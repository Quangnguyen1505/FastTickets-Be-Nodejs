'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('seat_statuses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
      },
      seat_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Seats',
          key: 'id'
        }
      },
      showtime_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Showtimes',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM('available', 'booked', 'reserved', 'unavailable'),
        defaultValue: 'available',
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
    await queryInterface.dropTable('seat_statuses');
  }
};