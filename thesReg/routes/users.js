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
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.get('/logout', userController.getLogout);

module.exports = router;
