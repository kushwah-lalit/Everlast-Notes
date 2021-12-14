const express = require('express');
const router = express.Router();
console.log("Router Loaded");
const userController = require('../controllers/user_controller');
router.get('/login',userController.login);
module.exports = router;