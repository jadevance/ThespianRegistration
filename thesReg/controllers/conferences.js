var conferencesModel = require('../models/conferences.js');

var ConferencesController = {

  getAllConferences: function(request, response) {
    console.log('do something')
  },

  getSingleConference: function(request, response) {
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
            isNew: false,
            editing: false,
            conference: conference,
            yearOptions: ConferencesController.getYear()
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
        isNew: true,
        editing: true,
        conference: {
          title: null,
          year: null,
          registration_status: null,
          location_name: null,
          location_address: null,
          location_city: null,
          location_state: null,
          location_zip: null
        },
        yearOptions: ConferencesController.getYear()
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
            isNew: false,
            editing: true,
            conference: conference,
            yearOptions: ConferencesController.getYear()
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
  },

  getYear: function() {
    var now = new Date().getFullYear();
    const yearOptions = [now];

    for (i=0; i<4; i++) {
      now += 1;
      yearOptions.push(now);
    }
    return yearOptions;
  }

};

module.exports = ConferencesController;