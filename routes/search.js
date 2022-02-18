const express = require('express');
const router = express.Router();
const passport = require('passport');
console.log("Router Loaded");
const searchController = require('../controllers/search_controller');
router.post('/problems',passport.checkAuthentication,searchController.searchProblems);
module.exports = router;