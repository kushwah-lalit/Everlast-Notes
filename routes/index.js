const express = require('express');
const router = express.Router();
const passport = require('passport');
console.log("Router Loaded");
const dashController = require('../controllers/dash_controller');
router.get('/',passport.checkAuthentication,dashController.home);
router.use('/users', require('./user'));
module.exports = router;