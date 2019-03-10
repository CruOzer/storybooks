const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');


// Handelbars Helper
const {
    truncate,
    stripTags,
    formatDate,
    select
} = require('./helpers/hbs');

// Load models
require('./models/User');
require('./models/Story');

// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('MongoDB connected...');
    })
    .catch((err) => {
        console.log('MongoDB connection failure: ' + err);
    });


// Passport config
require('./config/passport')(passport);

// Handlebars Middleware
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

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

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

// Method-Override Middleware
// override with the X-HTTP-Method-Override header in the request
//app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('_method'));

// Global variables
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server startet on ${port}`);
});