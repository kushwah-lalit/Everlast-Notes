const express = require('express');
const router = express.Router();
const passport = require('passport');
console.log("Router Loaded");
const categoryController = require('../controllers/categories_controller');
router.get('/:topic', passport.checkAuthentication,categoryController.showProblems);
module.exports = router;