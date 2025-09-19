const express = require('express');

const app = express();

const port = 8003;

const { connectDB } = require('./connect')

const URL = require('./models/url')

const urlRoute = require('./routes/url');

connectDB('mongodb://localhost:27017/short-url').then(()=> console.log(`MongoDB Connected`)).catch((err)=>console.log(`Error connecting MongoDB ${err}`));

// Middlewares for getting url from res.body
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('URL Shortener API is running ');
});
app.use('/url', urlRoute);

app.get('/url/:shortID', async (req, res) => {
    try {
        const shortID = req.params.shortID;
        console.log("[GET] Requested shortID:", shortID);

        const entry = await URL.findOneAndUpdate(
            { shortID },
            { $push: { visitHistory: { timestamp: Date.now() } } },
            { new: true }
        );

        if (!entry) {
            return res.status(404).json({ error: "Short URL not found" });
        }

        return res.redirect(entry.redirectURL);
    } catch (err) {
        console.error("Error in redirect route:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.listen(port, ()=>console.log(`Server start at Port: ${port}`));