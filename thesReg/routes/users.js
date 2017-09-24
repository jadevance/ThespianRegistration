var express = require('express');
var router = express.Router();
var passport = require('passport');

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

module.exports = router;
