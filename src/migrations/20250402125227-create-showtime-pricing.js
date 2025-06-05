'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('showtime_pricings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
      },
      show_time_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Showtimes',
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
      surcharge: {
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('showtime_pricings');
  }
};