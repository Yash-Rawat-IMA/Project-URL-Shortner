const express = require('express');

const router = express.Router();

const { generateNewURL } = require('../controller/url')

router.post('/', generateNewURL);
module.exports = router;