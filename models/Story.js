const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const StorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public'
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    comments: [{
        commentBoy: {
            type: String,
            required: true
        },
        commentDate: {
            type: Date,
            default: Date.now
        },
        commentUser: {
            type: Schema.Types.ObjecId,
            ref: 'users'
        }
    }],
    user: {
        type: Schema.Types.ObjecId,
        ref: 'users'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('stories', StorySchema, 'stories');