const express = require('express');
const MovieController = require('../../controllers/movie.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.get("/findAll", handlerError(MovieController.getAllMovie));
router.get("/findOne/:id", handlerError(MovieController.getMovieById));
router.get("/search/:title", handlerError(MovieController.searchMovieByTitle));

router.use(authencationV2);

router.post("/create", handlerError(MovieController.createMovie));
router.post("/update", handlerError(MovieController.updateMovie));

module.exports = router;