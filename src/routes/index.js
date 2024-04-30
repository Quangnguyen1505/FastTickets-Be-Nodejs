const express = require('express');
const router = express.Router();

router.use('/v1/api/access', require('./Access'));
router.use('/v1/api/movie', require('./Movie'));

module.exports = router