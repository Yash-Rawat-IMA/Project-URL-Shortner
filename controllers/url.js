const shortid = require('shortid')

const URL = require('../models/url');

async function generateNewURL(req, res) {
    const body = req.body;
    if(!body.url){
        return res.status(400).json({error: 'URL required'});
    }
    const shortID = shortid(8);
    await URL.create({
        shortID: shortID,
        redirectURL: body.url,
        visitedHistory: [],
    });
    console.log(`Created new URL: ${body.url} with short id: ${shortID}`);
    return res.json({id: shortID});
}

async function redirectToURL(req, res) {
    const shortID = req.params.shortID;
    console.log(`Request of shortID: ${shortID} accepted...`)
    const entry = await URL.findOneAndUpdate(
        { shortID: shortID, },
        {
            $push: {
                visitedHistory: {
                    timestamp: Date.now()
                }
            }
        },
        { new: true }
    );
    
    if (!entry) {
        console.log(`No entry found with this shortID ${shortID}`);
        return res.json({ err: `No entry found on this shortid: ${shortID}` })
    }
    console.log("Redirecting URL", entry.redirectURL)
    console.log(`Total visits: ${entry.visitedHistory.length}`)
    let url = entry.redirectURL;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
    }
    return res.redirect(url);
}

async function deleteURL(req, res) {
    const shortID = req.params.shortID;
    const entry = await URL.findOneAndDelete({shortID});
    if(!entry){
        console.log(`No entry found with short ID: ${shortID}`);
        return res.send({short_id:`${shortID}`, err: `No entry found`})
    }
    console.log(`URL: ${entry.redirectURL} with short ID: ${entry.shortID}  ${shortID} deleted`);
    return res.json({url: `${entry.redirectURL}`, short_id: `${entry.shortID}`, msg: `Deleted`});
}

async function visitsOnShortID(req, res) {
    const shortID = req.params.shortID;
    const entry = await URL.findOne({
        shortID
    });
    const length = entry.visitedHistory.length;
    console.log(`The total number of clicks are: ${length}`);
    const html = `<h1>The total visits on the url <a href="${entry.redirectURL}" target="_blank" style="color: blue; background-color: grey; ">${entry.redirectURL}</a> is: ${length}<h1>`
    return res.send(html);
}

module.exports = {
    generateNewURL,
    redirectToURL,
    deleteURL,
    visitsOnShortID,
}