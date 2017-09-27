var userModel = require('../models/users.js');

var UsersController = {

  getLogout: function(request, response) {
    request.logout();
    request.session.destroy();
    response.redirect('/');
  },

  completeProfile: function(request, response) {
    if (!request.user.complete_profile) {
      response.redirect('/profile/' + request.user.id);
    } else {
      response.redirect('/');
    }
  },

  getProfile: function(request, response) {
    if(request.user && !request.user.complete_profile) {
      response.render('profile', {
        user: request.user,
        loggedIn: true,
        editing: true
      });
    } else if (request.user) {
      response.render('profile', {
        user: request.user,
        loggedIn: true,
        editing: false
      });
    } else {
      response.redirect('/');
    }
  },

  editProfile: function(request, response) {
    response.render('profile', {
      user: request.user,
      loggedIn: true,
      editing: true
    })
  },

  updateProfile: function(request, response) {
    userModel.updateProfile(request.body, request.user, function(error, user) {
      if(error) {
        var err = new Error;
        err.status = 500;
        err.error = "Error updating user profile";
        response.json(err)
      } else {
        response.redirect('/');
      }
    })
  }
};

module.exports = UsersController;