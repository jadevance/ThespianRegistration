var express = require('express');
var router = express.Router();
var passport = require('passport');
var userController = require('../controllers/users.js');

router.get('/auth/google',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/',
    scope: ['email']
  }));

router.get('/auth/google/callback',
  passport.authenticate('google'), userController.completeProfile);

router.get('/logout', userController.getLogout);

module.exports = router;
