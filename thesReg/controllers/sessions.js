var sessionsModel = require('../models/sessions.js');

var SessionsController = {

  newSessionForm: function(request, response) {
    const loggedIn = request.isAuthenticated();
    if (loggedIn && (request.user.user_level === 1)) {
      response.render('conferences', {
        loggedIn: loggedIn,
        user: request.user,
        isNewSession: true,
        editingSession: true,
        session: {
          id: null,
          conference_id: request.params.conferenceId,
          start_time: null,
          end_time: null
        },
      })
    } else {
      response.redirect('/')
    }
  }
};

module.exports = SessionsController;