'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const categories = [
      {
        cate_name: 'Hành động',
        cate_slug: 'hanh-dong',
        cate_description: 'Phim tập trung vào các pha hành động, mạo hiểm, kịch tính.',
      },
      {
        cate_name: 'Phiêu lưu',
        cate_slug: 'phieu-luu',
        cate_description: 'Phim kể về những cuộc hành trình, khám phá mới lạ.',
      },
      {
        cate_name: 'Hài',
        cate_slug: 'hai',
        cate_description: 'Phim mang tính giải trí, hài hước, gây cười.',
      },
      {
        cate_name: 'Kinh dị',
        cate_slug: 'kinh-di',
        cate_description: 'Phim tạo cảm giác sợ hãi, hồi hộp, thường có yếu tố siêu nhiên.',
      },
      {
        cate_name: 'Tình cảm',
        cate_slug: 'tinh-cam',
        cate_description: 'Phim tập trung vào các mối quan hệ, câu chuyện tình yêu.',
      },
      {
        cate_name: 'Viễn tưởng',
        cate_slug: 'vien-tuong',
        cate_description: 'Phim lấy bối cảnh tương lai, công nghệ hoặc thế giới giả tưởng.',
      },
      {
        cate_name: 'Hoạt hình',
        cate_slug: 'hoat-hinh',
        cate_description: 'Phim được tạo ra bằng kỹ thuật hoạt hình, dành cho nhiều lứa tuổi.',
      },
      {
        cate_name: 'Tội phạm',
        cate_slug: 'toi-pham',
        cate_description: 'Phim kể về tội phạm, điều tra, phá án.',
      },
      {
        cate_name: 'Chính kịch',
        cate_slug: 'chinh-kich',
        cate_description: 'Phim tập trung vào nội dung sâu sắc, tình tiết nghiêm túc.',
      },
      {
        cate_name: 'Lịch sử',
        cate_slug: 'lich-su',
        cate_description: 'Phim dựa trên các sự kiện, nhân vật lịch sử có thật.',
      },
      {
        cate_name: 'Chiến tranh',
        cate_slug: 'chien-tranh',
        cate_description: 'Phim lấy bối cảnh các cuộc chiến, quân sự.',
      },
      {
        cate_name: 'Âm nhạc',
        cate_slug: 'am-nhac',
        cate_description: 'Phim xoay quanh chủ đề âm nhạc, ca hát, nghệ thuật biểu diễn.',
      },
      {
        cate_name: 'Thần thoại',
        cate_slug: 'than-thoai',
        cate_description: 'Phim dựa trên các câu chuyện thần thoại, truyền thuyết.',
      },
      {
        cate_name: 'Gia đình',
        cate_slug: 'gia-dinh',
        cate_description: 'Phim phù hợp cho cả gia đình, có nội dung nhẹ nhàng, giáo dục.',
      },
      {
        cate_name: 'Khoa học viễn tưởng',
        cate_slug: 'khoa-hoc-vien-tuong',
        cate_description: 'Phim liên quan đến khoa học giả tưởng, công nghệ mới.',
      }
    ];
    
    const existing = await queryInterface.sequelize.query(
      `SELECT cate_slug FROM categories WHERE cate_slug IN (:slugs)`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          slugs: categories.map(c => c.cate_slug),
        },
      }
    );

    const existingSlugs = existing.map(e => e.cate_slug);

    const toInsert = categories
      .filter(c => !existingSlugs.includes(c.cate_slug))
      .map(c => ({
        ...c,
        id: Sequelize.literal('gen_random_uuid()'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    if (toInsert.length > 0) {
      await queryInterface.bulkInsert('categories', toInsert, {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', {
      cate_slug: [
        'hanh-dong',
        'phieu-luu',
        'hai',
        'kinh-di',
        'tinh-cam',
        'vien-tuong',
        'hoat-hinh',
        'toi-pham',
        'chinh-kich',
        'lich-su',
        'chien-tranh',
        'am-nhac',
        'than-thoai',
        'gia-dinh',
        'khoa-hoc-vien-tuong'
      ]
    }, {});
  }
};
