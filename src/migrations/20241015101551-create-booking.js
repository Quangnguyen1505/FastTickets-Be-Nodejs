'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
      },
      booking_roomId: {
        type: Sequelize.UUID,
        references: {
          model: 'Rooms',
          key: 'id'
        }
      },
      booking_movieId: {
        type: Sequelize.UUID,
        references: {
          model: 'Movies',
          key: 'id'
        }
      },
      booking_userId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      booking_date: {
        type: Sequelize.DATE
      },
      booking_total_checkout: {
        type: Sequelize.FLOAT
      },
      booking_status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
        defaultValue: 'pending'
      },
      booking_show_time_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Showtimes',
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
    await queryInterface.dropTable('Bookings');
  }
};