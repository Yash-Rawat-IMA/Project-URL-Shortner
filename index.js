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

app.get('/url/:id', async(req, res) => {
    const shortID = req.params.id;
    console.log(shortID)  //getting two outputs, 1st shortID and 2nd original url
    const entry = await URL.findOne(
        {shortID}
    )
    if(!entry){
        return res.status(404).json({ error: "Short URL not found" });
    }
    return res.redirect(entry.redirectURL);
})

app.listen(port, ()=>console.log(`Server start at Port: ${port}`));