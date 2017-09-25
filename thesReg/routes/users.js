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

router.get('/profile', userController.getProfile);

router.post('/profile', userController.updateProfile);

router.get('/profile/edit', userController.editProfile);

module.exports = router;
