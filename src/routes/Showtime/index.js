const express = require('express');
const router = express.Router();
const showtimeController = require('../../controllers/showtime.controller');
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const { checkAdmin } = require('../../middlewares/cache/checkAdmin.midlewares');

router.post('', handlerError(showtimeController.createShowTime));
router.get('/:showtime_id', handlerError(showtimeController.getShowTimeById));
router.get('/movies/:movie_id', handlerError(showtimeController.getAllShowTimeByMovieId));

// router.use(authencationV2);
router.get('/:showtime_id/tickets/:seat_type_id', handlerError(showtimeController.getTicketShowTime));
router.use(authencationV2);
router.use(checkAdmin);
router.get('', handlerError(showtimeController.getAllShowTime));
router.delete('/:showtime_id', handlerError(showtimeController.deleteShowTime));

module.exports = router
