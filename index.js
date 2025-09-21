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

app.get('/test', (req,res) => {
    console.log(`Server Test`);
    return res.end(`<body style="background-color:black;"><h1 style="background-color:grey; color: black;">Hi! from Server</h1></body>`)
})

app.use('/url', urlRoute);

app.get('/r/:shortID', async (req, res) => {
    try {
        const shortID = req.params.shortID;
        console.log("[GET] Requested shortID:", shortID);
        console.log("[GET] Requested type of shortID:",typeof shortID);
        const entry = await URL.findOneAndUpdate(
            {shortID},
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now()
                    },
                }
            }
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