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
            params: request.params,
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
  },

  editSession: function(request, response) {
    const loggedIn = request.isAuthenticated();
    if (loggedIn && (request.user.user_level === 1)) {
      conferencesModel.getSingleConference(request.params.conferenceId, function(error, conference, sessions) {

        for (var i=0; i<sessions.length; i++) {
          if (sessions[i].id == request.params.sessionId) {
            sessions[i].editing = true;
          } else {
            sessions[i].editing = false;
          }
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
            params: request.params,
            yearOptions: common.getYear()
          })
        }
      })
    } else {
      response.redirect('/')
    }
  },

  updateSession: function(request, response) {
    const loggedIn = request.isAuthenticated();
    if (loggedIn && (request.user.user_level === 1)) {
      sessionsModel.updateSession(request.body, request.params.sessionId, function(error, session) {
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
  },

  deleteSession: function(request, response) {
    const loggedIn = request.isAuthenticated();
    if (loggedIn && (request.user.user_level === 1)) {
      sessionsModel.deleteSession(request.params.sessionId, function(error, session) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error deleting session";
          response.json(err)
        } else {
          response.redirect('/conferences/' + request.params.conferenceId)
        }
      })
    } else {
      response.redirect('/')
    }
  },

  showRooms: function(request, response) {
    const loggedIn = request.isAuthenticated();
    if (loggedIn && (request.user.user_level === 1)) {
      conferencesModel.getSingleConference(request.params.conferenceId, function(error, conference, sessions) {

        for (var i=0; i<sessions.length; i++) {
          if (sessions[i].id === request.params.sessionId) {
            sessions[i].show_rooms = true;
          } else {
            sessions[i].show_rooms = false;
          }
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
            params: request.params,
            yearOptions: common.getYear()
          })
        }
      })
    } else {
      response.redirect('/')
    }
  }
};

module.exports = SessionsController;