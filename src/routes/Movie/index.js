const express = require('express');
const MovieController = require('../../controllers/movie.controller');
const router = express.Router();
const { handlerError } = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const { uploadDisk } = require('../../config/multer.config');
const { checkAdmin } = require('../../middlewares/cache/checkAdmin.midlewares');

router.get("", handlerError(MovieController.getAllMovie));
router.get("/:id", handlerError(MovieController.getMovieById));
router.get("/search/:title", handlerError(MovieController.searchMovieByTitle));

router.use(authencationV2);
router.use(checkAdmin);

router.post(
    "",  
    uploadDisk.single('file'),
    handlerError(MovieController.createMovie)
);
router.put(
    "/:id", 
    uploadDisk.single('file'), 
    handlerError(MovieController.updateMovie)
);
router.delete("/:id", handlerError(MovieController.deleteMovie));

module.exports = router;