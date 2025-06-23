const express = require('express');
const uploadController = require('../../controllers/upload.controller');
const { uploadDisk, uploadMemory } = require('../../config/multer.config');
const { authencationV2 } = require('../../auth/authUtils')
const router = express.Router();

router.use(authencationV2);

router.post('/thumb', uploadDisk.single('file'), uploadController.uploadImage);
router.post('/thumb/images', uploadDisk.array('files', 10), uploadController.uploadManyImage);
router.post('/video', uploadDisk.single('file'), uploadController.uploadVideoTrailer);

module.exports = router;