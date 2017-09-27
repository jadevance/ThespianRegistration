var sessionsModel = require('../models/sessions.js');
var conferencesModel = require('../models/conferences');
var common = require('./commonFunctions.js');

var SessionsController = {

  newSessionForm: function(request, response) {
    const loggedIn = request.isAuthenticated();
    if (loggedIn && (request.user.user_level === 1)) {
      conferencesModel.getSingleConference(request.params.conferenceId, function(error, conference, sessions) {
        if ((sessions.length > 1) || (sessions[0].id !== null)) {
          sessions.push(common.getEmptySession())
        }
        if(error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error getting conference to add session";
          response.json(err)
        } else {
          response.render('conferences', {
            loggedIn: loggedIn,
            user: request.user,
            isNewConference: false,
            editingConference: false,
            isNewSession: true,
            editingSession: true,
            conference: conference,
            sessions: sessions,
            yearOptions: common.getYear()
          })
        }
      })
    } else {
      response.redirect('/')
    }
  },

  createNewSession: function(request, response) {
    const loggedIn = request.isAuthenticated();
    if (loggedIn && (request.user.user_level === 1)) {
      sessionsModel.createNewSession(request.body, request.params.conferenceId, function(error, session) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error saving session";
          response.json(err)
        } else {
          response.redirect('/conferences/' + session.conference_id)
        }
      })
    } else {
      response.redirect('/')
    }
  }
};

module.exports = SessionsController;