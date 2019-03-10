const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');

// Passport config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');

const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect(process.env.MONGO_URI, {
        // useNewUrlParser: true        
        useMongoClient: true
    })
    .then(() => {
        console.log('MongoDB connected...');
    })
    .catch((err) => {
        console.log('MongoDB connection failure: ' + err);
    });


// Cookie-Parser middleware
app.use(cookieParser());

// Session Middleware
app.use(session({
    secret: 'mySecretService',
    resave: false,
    saveUninitialized: false
}));

// Passport Sessions AFTER Session middleware
app.use(passport.initialize());
app.use(passport.session());


// Global variables
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});


// Use Routes
app.use('/', index);
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server startet on ${port}`);
});