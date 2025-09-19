const { nanoid } = require('nanoid');
const URL = require('../models/url')

async function generateNewURL(req, res) {
    const body = req.body;

    if (!body.url) {
        console.log(`[POST] No URL found!`);
        return res.status(400).json({ error: "No URL found! Kindly provide the URL" });
    }

    const shortID = nanoid(8);

    console.log(`[POST] Generated shortID: ${shortID}`);
    console.log(`[POST] Original URL: ${body.url}`);

    await URL.create({
        shortID,
        redirectURL: body.url,
        visitHistory: [],
    });

    return res.json({
        id: shortID,
        shortUrl: `http://localhost:8003/${shortID}`,
        originalUrl: body.url
    });
}

module.exports = {
    generateNewURL,
}