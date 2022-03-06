const express = require('express');
const router = express.Router();
const passport = require('passport');
console.log("Router Loaded");
const practiceController = require('../controllers/practice_controller');
router.get('/:platform', passport.checkAuthentication,practiceController.showProblems);
router.get('/MarkAsDone/:id', passport.checkAuthentication,practiceController.addToProblems);
module.exports = router;