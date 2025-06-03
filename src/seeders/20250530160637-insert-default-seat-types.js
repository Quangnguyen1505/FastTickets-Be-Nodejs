'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const seatTypes = [
      {
        name: 'normal',
        description: 'Ghế thường, phù hợp với mọi vị trí trong rạp.',
      },
      {
        name: 'vip',
        description: 'Ghế cao cấp, vị trí trung tâm với chất lượng tốt hơn.',
      },
      {
        name: 'couple',
        description: 'Ghế đôi dành cho các cặp đôi, thiết kế rộng rãi và riêng tư.',
      }
    ];

    const existing = await queryInterface.sequelize.query(
      `SELECT name FROM "Seat_types" WHERE name IN (:names)`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          names: seatTypes.map(s => s.name),
        },
      }
    );

    const existingNames = existing.map(s => s.name);

    const toInsert = seatTypes
      .filter(s => !existingNames.includes(s.name))
      .map(s => ({
        ...s,
        id: Sequelize.literal('gen_random_uuid()'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    if (toInsert.length > 0) {
      await queryInterface.bulkInsert('Seat_types', toInsert, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Seat_types', {
      name: ['normal', 'vip', 'couple']
    }, {});
  }
};
