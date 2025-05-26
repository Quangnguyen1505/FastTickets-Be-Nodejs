const express = require('express');
const router = express.Router();
const snacksController = require('../../controllers/snacks.controller');
const { handlerError } = require('../../helper/asyncHandler');
const { uploadDisk } = require('../../config/multer.config');

router.get('', handlerError(snacksController.getSnacks));
router.get('/:snack_id', handlerError(snacksController.getSnackById));
router.post(
    '', 
    uploadDisk.single('file'),
    handlerError(snacksController.createSnack)
);
router.put(
    '/:snack_id', 
    uploadDisk.single('file'),
    handlerError(snacksController.updateSnack),
);
router.delete('/:snack_id', handlerError(snacksController.deleteSnack));

module.exports = router
