const express = require('express');
const router = express.Router();
const passport = require('passport');
console.log("Router Loaded");
const favouriteController = require('../controllers/favourite_controller');
router.get('/:platform', passport.checkAuthentication,favouriteController.showProblems);
router.get('/toggleLike/:id', passport.checkAuthentication,favouriteController.toggleFavourite);
module.exports = router;