'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      {
        role_name: 'Admin',
        role_slug: 'admin-system',
        role_status: 'active',
        role_description: 'Full access to all system features.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_name: 'User',
        role_slug: 'user-system',
        role_status: 'active',
        role_description: 'Limited access to user features.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
