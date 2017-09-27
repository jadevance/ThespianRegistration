var sessionsModel = require('../models/sessions.js');
var conferencesModel = require('../models/conferences');
var common = require('./commonFunctions.js');

var SessionsController = {

  newSessionForm: function(request, response) {
    const loggedIn = request.isAuthenticated();
    if (loggedIn && (request.user.user_level === 1)) {
      conferencesModel.getSingleConference(request.params.conferenceId, function(error, conference) {
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
            yearOptions: common.getYear(),
            session: {
              id: null,
              conference_id: conference.id,
              start_time: null,
              end_time: null
            }
          })
        }
      })
    } else {
      response.redirect('/')
    }
  }
};

module.exports = SessionsController;