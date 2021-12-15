const User =require('../models/user');
const fs = require('fs');
const path = require('path');
module.exports.login = function(req,res){
    if (req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('login',{
        title:'Everlast Notes'
    });
};
module.exports.signup = function(req,res){
    if (req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('signup',{
        title:'Create Account'
    });
};
// // sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}
// signout
module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out!');
    return res.redirect('/users/login');
}