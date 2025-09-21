const express = require('express');

const router = express.Router();

const { generateNewURL, redirectToURL, deleteURL, visitsOnShortID } = require('../controllers/url')

router.post('/', generateNewURL);

router.get('/:shortID', redirectToURL)

router.delete('/:shortID', deleteURL)

router.get('/visits/:shortID', visitsOnShortID)

module.exports = router;