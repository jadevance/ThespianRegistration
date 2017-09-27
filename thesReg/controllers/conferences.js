var conferencesModel = require('../models/conferences.js');
var common = require('./commonFunctions.js');

var ConferencesController = {

  getAllConferences: function(request, response) {
    console.log('do something')
  },

  getSingleConference: function(request, response) {
    const loggedIn = request.isAuthenticated();
    if (loggedIn && (request.user.user_level === 1)) {
      conferencesModel.getSingleConference(request.params.conferenceId, function(error, conference, sessions) {
        if(error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error getting conference";
          response.json(err)
        } else {
          response.render('conferences', {
            user: request.user,
            loggedIn: loggedIn,
            isNewConference: false,
            editingConference: false,
            isNewSession: false,
            editingSession: false,
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

  newConferenceForm: function(request, response) {
    const loggedIn = request.isAuthenticated();
    if (loggedIn && (request.user.user_level === 1)) {
      response.render('conferences', {
        loggedIn: loggedIn,
        user: request.user,
        isNewConference: true,
        editingConference: true,
        conference: common.getEmptyConference(),
        sessions: common.getEmptySession(),
        params: request.params,
        yearOptions: common.getYear()
      })
    } else {
      response.redirect('/')
    }
  },

  createNewConference: function(request, response) {
    conferencesModel.createNewConference(request.body, function(error, conference) {
      if(error) {
        var err = new Error;
        err.status = 500;
        err.error = "Error saving conference";
        response.json(err)
      } else {
        response.redirect('/conferences/' + conference.id)
      }
    })
  },

  editConference: function(request, response) {
    const loggedIn = request.isAuthenticated();
    if (loggedIn && (request.user.user_level === 1)) {
      conferencesModel.getSingleConference(request.params.conferenceId, function(error, conference) {
        if(error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error getting conference";
          response.json(err)
        } else {
          response.render('conferences', {
            user: request.user,
            loggedIn: loggedIn,
            isNewConference: false,
            editingConference: true,
            conference: conference,
            params: request.params,
            yearOptions: common.getYear()
          })
        }
      })
    } else {
      response.redirect('/')
    }
  },

  updateConference: function(request, response) {
    conferencesModel.updateConference(request.params.conferenceId, request.body, function(error, conference) {
      if(error) {
        var err = new Error;
        err.status = 500;
        err.error = "Error saving conference";
        response.json(err)
      } else {
        response.redirect('/conferences/' + conference.id)
      }
    })
  }
};

module.exports = ConferencesController;