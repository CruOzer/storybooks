const express = require('express');
const router = express.Router();
const {
    ensureAuthenticated,
    ensureGuest
} = require('../helpers/auth');


// Storiey Index
router.get('/', (req, res) => {
    res.render('stories/index');
});

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

// Edit Story Form
router.get('/edit', ensureAuthenticated, (req, res) => {
    res.render('stories/edit');
});


router.post('/', (req, res) => {

});

module.exports = router;