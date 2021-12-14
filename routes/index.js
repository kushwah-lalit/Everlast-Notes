const express = require('express');
const router = express.Router();
console.log("Router Loaded");
const dashController = require('../controllers/dash_controller');
router.get('/',dashController.home);
router.use('/user', require('./user'));
module.exports = router;