'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Seats', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
      },
      seat_row: {
        type: Sequelize.STRING
      },
      seat_number: {
        type: Sequelize.INTEGER
      },
      seat_status: {
        type: Sequelize.ENUM('available', 'booked', 'reserved', 'unavailable'),
        defaultValue: 'available'
      },
      seat_roomId: {
        type: Sequelize.UUID,
        references: {
          model: 'Rooms',
          key: 'id'
        }
      },
      seat_type_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Seat_types',
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
    await queryInterface.dropTable('Seats');
  }
};