const express = require('express');
const app = express();

const urlRoute = require('./routes/url')

const URL = require('./models/url')

const { connectDB } = require('./connect')

const port = 8001;

connectDB('mongodb://127.0.0.1:27017/url_shortner')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    console.log(`Get Request`);
    res.json({ msg: `Get Request received` });
})

// Server side rendering -  but this will put all the load on the server to render even the front-end i.e. html, css and js part and is not scalable in long term. To overcome this we'll use templating engines like: "EJS", "PUG JS" and can store the front-end part in "view" folder
app.get('/test', async(req, res)=>{
    console.log(`Testing get request`);
    const allURLs = await URL.find({});
    const html = `<ol>
    ${allURLs.map(url => `<h2><li>${url.redirectURL} - ${url.visitedHistory.length}</li></h2>`).join("")}
    </ol>`;
    res.send(html);
})

app.use('/url', urlRoute);

app.listen(port, () => console.log(`Server Started at Port: ${port}`));
// app.get('/:shortid', async (req, res) => {
//     const shortID = req.params.shortid;
//     console.log(`Request of shortID: ${shortID} accepted...`)
//     const entry = await URL.findOneAndUpdate(
//         { shortID: shortID, },
//         {
//             $push: {
//                 visitedHistory: {
//                     timestamp: Date.now()
//                 }
//             }
//         },
//         { new: true }
//     );
    
//     if (!entry) {
//         console.log(`No entry found with this shortID ${shortID}`);
//         return res.json({ err: `No entry found on this shortid: ${shortID}` })
//     }
//     console.log("Redirecting URL", entry.redirectURL)
//     console.log(`Total visits: ${entry.visitedHistory.length}`)
//     let url = entry.redirectURL;
//     if (!url.startsWith('http://') && !url.startsWith('https://')) {
//                 url = 'https://' + url;
//     }
//     return res.redirect(url);
// })

// app.get('/visits/:shortID', async(req, res) =>{
//     const shortID = req.params.shortID;
//     const entry = await URL.findOne({
//         shortID
//     });
//     const length = entry.visitedHistory.length;
//     console.log(`The total number of clicks are: ${length}`);
//     const html = `<h1>The total visits on the url <a href="${entry.redirectURL}" target="_blank" style="color: blue; background-color: grey; ">${entry.redirectURL}</a> is: ${length}<h1>`
//     return res.send(html);
// })


// app.delete('/:shortID', async(req, res) => {
//     const shortID = req.params.shortID;
//     const entry = await URL.findOneAndDelete({shortID});
//     console.log(`URL: ${entry.redirectURL} with short ID: ${entry.shortID}  ${shortID} deleted`);
//     return res.json({url: `${entry.redirectURL}`}).json({short_id: `${entry.shortID} ${shortID}`}).json({msg: `Deleted`});
// })