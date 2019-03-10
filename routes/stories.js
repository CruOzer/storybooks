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
    }).populate('user').sort({
        date: 'desc'
    }).then(stories => {
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
        if (story) {
            res.render('stories/edit', {
                story: story
            });
        } else {
            res.redirect('/stories');
        }
    }).catch(err => console.log(err));
});

// Show single story
router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).populate('user').populate('comments.commentUser').then(story => {
        if (story.status == 'public' || (req.user && req.user.id === story.user.id)) {
            res.render('stories/show', {
                story: story
            });
        } else {
            res.redirect('/stories');
        }
    }).catch(err => console.log(err));
});

// List stories from a user
router.get('/user/:userId', (req, res) => {
    Story.find({
        user: req.params.userId,
        status: 'public'
    }).populate('user').then(stories => {
        res.render('stories/index', {
            stories: stories
        })
    }).catch(err => console.log(err))
});

// Logged in users story
router.get('/my', ensureAuthenticated, (req, res) => {
    Story.find({
        user: req.user.id,
    }).populate('user').then(stories => {
        res.render('stories/index', {
            stories: stories
        })
    }).catch(err => console.log(err))
});


// Add story
router.post('/', ensureAuthenticated, (req, res) => {
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
router.put('/:id', ensureAuthenticated, (req, res) => {
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
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Story.deleteOne({
        _id: req.params.id,
        user: req.user.id
    }).then(data => {
        res.redirect('/dashboard');
    }).catch(err => console.log(err));
})

// Add Comment
router.post('/comment/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).then(story => {
        const newComment = {
            commentBody: req.body.commentBody,
            commentUser: req.user.id
        }
        // Add to comments array
        story.comments.unshift(newComment);
        story.save().then(story => res.redirect(`/stories/show/${story.id}`)).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

module.exports = router;