const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
// Load user model
require('../models/User');
const User = mongoose.model('users');

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        proxy: true
    }, (acccessToken, refreshToken, profile, done) => {
        const image = profile.photos[0].value;
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;
        const id = profile.id;
        const email = profile.emails[0].value;
        const newUser = {
            googleID: id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            image: image
        };

        // Check for existing
        User.findOne({
            googleID: id
        }).then(user => {
            if (user) {
                // return user
                done(null, user);
            } else {
                // Create user
                new User(newUser).save().then(user => done(null, user)).catch(err => done(null, false, err));
            }
        }).catch(err => done(null, false, err));
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};