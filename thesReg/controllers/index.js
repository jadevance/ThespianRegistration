var conferencesModel = require('../models/conferences.js');

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
          response.render('index', {
            user: request.user,
            conferences: conferences,
            loggedIn: true
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