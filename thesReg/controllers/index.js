var conferencesModel = require('../models/conferences.js');
var registrationsModel = require('../models/registrations.js');

var IndexController = {
  getIndex: function(request, response) {
    if(request.user) {
      conferencesModel.getAllConferences(function(error, conferences) {
        if(error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error finding conferences";
          response.json(err)
        } else {
          registrationsModel.getUserRegistrations(request.user.id, function(error, registrations) {
            if (error) {
              var err = new Error;
              err.status = 500;
              err.error = "Error finding registrations";
              response.json(err)
            } else {
              response.render('index', {
                user: request.user,
                conferences: conferences,
                registrations: registrations,
                loggedIn: true
              })
            }
          })
        }
      })
    } else {
      response.render('index', {
        loggedIn: false
      })
    }
  }
}

module.exports = IndexController;