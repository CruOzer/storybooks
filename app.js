const express = require('express');
const path = require('path');
const mongoose = require('mongoose');


const app = express();

// DB Config
const db = require('./config/database');
// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect(db.mongoURI, {
        // useNewUrlParser: true        
        useMongoClient: true
    })
    .then(() => {
        console.log('MongoDB connected...');
    })
    .catch((err) => {
        console.log('MongoDB connection failure: ' + err);
    });

app.get('/', (req, res) => {
    res.send('It works');
})


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server startet on ${port}`);
});