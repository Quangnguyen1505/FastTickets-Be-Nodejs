const express = require('express');
const cinemaController = require('../../controllers/cinema.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.get("/findAll", handlerError(cinemaController.getAllCinema));
router.get("/findOne/:cinemaId/:movieId", handlerError(cinemaController.getCinemaById));

router.use(authencationV2);

router.post("/create", handlerError(cinemaController.createCinema));
// router.post("/update", handlerError(MovieController.updateMovie));

module.exports = router