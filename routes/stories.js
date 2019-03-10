const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

const {
    ensureAuthenticated,
    ensureGuest
} = require('../helpers/auth');


// Storiey Index
router.get('/', (req, res) => {
    Story.find({
        status: 'public'
    }).populate('user').then(stories => {
        res.render('stories/index', {
            stories: stories
        });
    }).catch(err => {
        console.log(err);
    });
});

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id: req.params.id,
        user: req.user.id
    }).populate('user').then(story => {
        res.render('stories/edit', {
            story: story
        });
    }).catch(err => console.log(err));
});

// Show single story
router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).populate('user').then(story => {
        res.render('stories/show', {
            story: story
        });
    }).catch(err => console.log(err));
});

// Add story
router.post('/', (req, res) => {
    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: req.body.allowComments ? true : false,
        user: req.user.id
    }
    // Create Story
    new Story(newStory).save().then(story => {
        res.redirect(`/stories/show/${story.id}`);
    }).catch(err => {
        console.log(err);
        res.redirect('/stories/add');
    });

});

// Edit story
router.put('/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id,
        user: req.user.id
    }).then(story => {
        story.title = req.body.title;
        story.body = req.body.body;
        story.status = req.body.status;
        story.allowComments = req.body.allowComments ? true : false;
        story.save().then(story => res.redirect('/dashboard')).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

// Delete story
router.delete('/:id', (req, res) => {
    Story.deleteOne({
        _id: req.params.id,
        user: req.user.id
    }).then(data => {
        res.redirect('/dashboard');
    }).catch(err => console.log(err));
})

module.exports = router;