const mongoose = require('mongoose');

async function connectDB(url) {
    return mongoose.connect(url).then(()=> console.log(`MongoDB connected hurray!!`)).catch((err) => console.error(`Error connecting the MongoDB ${err}`));
}

module.exports = {
    connectDB,
}