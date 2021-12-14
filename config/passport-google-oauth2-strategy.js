const passport = require('passport');
// as passport google outh has both 0auth2 ans 1 so we took it....but now wwe will be using the OAuth2 strategy only
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
// if in case user signup using the google then we need the some password as our field might remain empty...so crypto generates the random password
const crypto = require('crypto');
const User = require('../models/user');

// const env = require('./environment');

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: '1021920566916-6s9ppl7nrtasa3roi58auccguifg95gi.apps.googleusercontent.com', // e.g. asdfghjkkadhajsghjk.apps.googleusercontent.com
        clientSecret: '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', // e.g. _ASDFA%KFJWIASDFASD#FAD-
        callbackURL: "http://localhost:8000/users/auth/google/callback"
    },

    function(accessToken, refreshToken, profile, done){
        // google aslo gives toke here it is accesstoken, refreshtoken if token expires
        // find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if (err){console.log('error in google strategy-passport', err); return;}
            console.log(accessToken, refreshToken);
            console.log(profile);

            if (user){
                // if found, set this user as req.user
                user.name = profile.displayName;
                user.avatar = profile.photos[0].value;
                user.save();
                return done(null, user);
            }else{
                // if not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                    avatar:profile.photos[0].value
                }, function(err, user){
                    if (err){console.log('error in creating user google strategy-passport', err); return;}
                    return done(null, user);
                });
            }
        }); 
    }
));


module.exports = passport;
