var app = require('../app.js');
var db = app.get('db');

var Sessions = function() {};

Sessions.createNewSession = function(formData, conferenceId, callback) {
  db.sessions.save({conference_id: conferenceId,
                    start_time: formData.start_time,
                    end_time: formData.end_time},
    function(error, newSession) {
      if (error || !newSession) {
        callback(error, undefined)
      } else {
        callback(null, newSession)
      }
    }
  )
};

Sessions.updateSession = function(formData, sessionId, callback) {
  db.sessions.save({id: sessionId,
                    start_time: formData.start_time,
                    end_time: formData.end_time},
    function(error, updatedSession) {
      if (error || !updatedSession) {
        callback(error, undefined)
      } else {
        callback(null, updatedSession)
      }
    }
  )
};

Sessions.deleteSession = function(sessionId, callback) {
  db.sessions.destroy({id: sessionId},
    function(error, deletedSession) {
      if (error || !deletedSession) {
        callback(error, undefined)
      } else {
        callback(null, deletedSession)
      }
    }
  )
};

module.exports = Sessions;