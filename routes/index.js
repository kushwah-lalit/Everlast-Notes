const express = require('express');
const router = express.Router();
const passport = require('passport');
console.log("Router Loaded");
const dashController = require('../controllers/dash_controller');
const contestController = require('../controllers/contest_controller');
const documentController = require('../controllers/document_controller');
router.get('/',passport.checkAuthentication,dashController.home);
router.use('/users', require('./user'));
router.use('/problem',require('./problem'));
router.use('/category',require('./category'));
router.use('/search',require('./search'));
router.get('/contests',passport.checkAuthentication,contestController.contestPage);
router.use('/documents',require('./documents'));
module.exports = router;