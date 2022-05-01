require('dotenv').config();
const passport = require('passport');
// as passport google outh has both 0auth2 ans 1 so we took it....but now wwe will be using the OAuth2 strategy only
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
// if in case user signup using the google then we need the some password as our field might remain empty...so crypto generates the random password
const crypto = require('crypto');
const User = require('../models/user');

// const env = require('./environment');

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    //credentials
        clientID:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        callbackURL:process.env.CALLBACK_URL
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
                let ImgUrl = profile.photos[0].value.replace("=s96-c","=s720-c");
                // user.name = profile.displayName;
                if(user.avatar.endsWith("=s720-c")){
                    user.avatar = ImgUrl;
                }
                user.save();
                return done(null, user);
            }else{
                // if not found, create the user and set it as req.user
                const ImgUrl = profile.photos[0].value.replace("=s96-c","=s720-c");
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                    avatar:ImgUrl,
                    isVerified:profile.emails[0].verified
                }, function(err, user){
                    if (err){console.log('error in creating user google strategy-passport', err); return;}
                    return done(null, user);
                });
            }
        }); 
    }
));


module.exports = passport;
