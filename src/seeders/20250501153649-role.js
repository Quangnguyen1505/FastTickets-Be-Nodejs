'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = [
      {
        role_name: 'Admin',
        role_slug: 'admin-system',
        role_status: 'active',
        role_description: 'Full access to all system features.',
      },
      {
        role_name: 'User',
        role_slug: 'user-system',
        role_status: 'active',
        role_description: 'Limited access to user features.',
      }
    ];

    const existing = await queryInterface.sequelize.query(
      `SELECT role_slug FROM "Roles" WHERE role_slug IN (:slugs)`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          slugs: roles.map(r => r.role_slug),
        },
      }
    );

    const existingSlugs = existing.map(r => r.role_slug);

    const toInsert = roles
      .filter(r => !existingSlugs.includes(r.role_slug))
      .map(r => ({
        ...r,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    if (toInsert.length > 0) {
      await queryInterface.bulkInsert('Roles', toInsert, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', {
      role_slug: ['admin-system', 'user-system']
    }, {});
  }
};
