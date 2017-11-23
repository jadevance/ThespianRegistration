var registationsModel = require('../models/registrations.js');
var conferencesModel = require('../models/conferences.js');

var RegistrationsController = {

  createNewRegistration: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      registationsModel.createNewRegistration(request.user.id, request.params.conferenceId, function (error, registration, conference) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error saving registration";
          response.json(err)
        } else {
          response.render('registration', {
            user: request.user,
            loggedIn: loggedIn,
            conference: conference,
            registration: registration,
            registered_students: []
          })
        }
      })
    } else {
      response.redirect('/')
    }
  },

  editRegistration: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      registationsModel.getRegistration(request.params.registrationId, function(error, registration, conference, students) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error getting registration";
          response.json(err)
        } else {
          response.render('registration', {
            user: request.user,
            loggedIn: loggedIn,
            conference: conference,
            registration: registration,
            registered_students: students
          })
        }
      })
    } else {
      response.redirect('/')
    }
  }
};

module.exports = RegistrationsController;