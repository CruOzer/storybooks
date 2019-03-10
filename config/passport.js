const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        proxy: true
    }, (acccessToken, refreshToken, profile, done) => {
        console.log(acccessToken);
        console.log(profile);
    }))

};