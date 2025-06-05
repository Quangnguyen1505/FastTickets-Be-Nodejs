// src/services/upload.grpc.js
const fs = require('fs');
const path = require('path');
const UploadService = require('../../services/upload.service');

const UploadImage = async (call, callback) => {
  try {
    const { file_name, image_data } = call.request;

    if (!file_name || !image_data) {
      return callback(new Error('Thiếu file_name hoặc image_data'));
    }
    console.log("grpc req, ",file_name, file_name)
    // Tạo file tạm (vd: ./uploads/tmp-xxx.jpg)
    const tempFilePath = path.join(__dirname, '../../uploads', `tmp-${Date.now()}-${file_name}`);
    fs.writeFileSync(tempFilePath, image_data);

    // Gọi lại logic upload có sẵn
    const result = await UploadService.uploadImageFromLocal({ path: tempFilePath });

    //  Xoá file sau khi upload xong (tránh đầy ổ)
    fs.unlinkSync(tempFilePath);

    // Trả kết quả về client
    callback(null, { image_url: result.image_url });

  } catch (err) {
    console.error('UploadImage gRPC Error:', err);
    callback(err);
  }
};

module.exports = {
  UploadImage,
};
