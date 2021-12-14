const express = require('express');
const router = express.Router();
const passport = require('passport');
console.log("Router Loaded");
const userController = require('../controllers/user_controller');
router.get('/login',userController.login);
// usemiddleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/users/login'}
),userController.createSession);
// sign out
router.get('/sign-out', userController.destroySession);
// for the google
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/login'}),userController.createSession);
module.exports = router;