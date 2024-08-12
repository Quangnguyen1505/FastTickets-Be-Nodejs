'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rooms', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
      },
      room_name: {
        type: Sequelize.STRING
      },
      room_seat_quantity: {
        type: Sequelize.INTEGER
      },
      room_seat_type: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      room_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      room_currently_showing: {
        type: Sequelize.UUID,
        references: {
          model: 'Movies',
          key: 'id'
        }
      },
      room_previously_shown: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        defaultValue: []
      },
      room_release_date: {
        type: Sequelize.DATE
      },
      room_show_times: {
        type: Sequelize.ARRAY(Sequelize.DATE)
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
    await queryInterface.dropTable('Rooms');
  }
};