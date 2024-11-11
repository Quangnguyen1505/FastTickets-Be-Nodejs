const express = require('express');
const MovieController = require('../../controllers/movie.controller');
const router = express.Router();
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const { uploadDisk } = require('../../config/multer.config');

router.get("/findAll", handlerError(MovieController.getAllMovie));
router.get("/findOne/:id", handlerError(MovieController.getMovieById));
router.get("/findByStatus", handlerError(MovieController.getAllMovieByStatus));
router.get("/search/:title", handlerError(MovieController.searchMovieByTitle));

router.use(authencationV2);

router.post(
    "/create",  
    uploadDisk.fields([ // dùng fields để upload nhiều file
        { name: 'file', maxCount: 1 },         // Để upload ảnh
        { name: 'file_video', maxCount: 1 }    // Để upload video
    ]),
    handlerError(MovieController.createMovie)
);
router.post("/update", handlerError(MovieController.updateMovie));
router.get("/delete/:id", handlerError(MovieController.deleteMovie));

module.exports = router;