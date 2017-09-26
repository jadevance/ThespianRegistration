var conferencesModel = require('../models/conferences.js');

var ConferencesController = {

  getAllConferences: function(request, response) {
    console.log('do something')
  },

  newConferenceForm: function(request, response) {
    const loggedIn = request.isAuthenticated();
    response.render('conferences', {
      loggedIn: loggedIn,
      user: request.user
    })
  }

};

module.exports = ConferencesController;