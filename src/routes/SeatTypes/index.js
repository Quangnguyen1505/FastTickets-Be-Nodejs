const express = require('express');
const router = express.Router();
const seatTypeController = require('../../controllers/seatType.controller');
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const { checkAdmin } = require('../../middlewares/cache/checkAdmin.midlewares');

router.get('/:seatTypeId', handlerError(seatTypeController.findSeatTypeById));
router.get('', handlerError(seatTypeController.findAllSeatTypes));

router.use(authencationV2);
router.use(checkAdmin);
router.post('', handlerError(seatTypeController.createSeatType));
router.delete("/:id",  handlerError(seatTypeController.deleteSeatType));
router.put("/:id",  handlerError(seatTypeController.updateSeatType));

module.exports = router;