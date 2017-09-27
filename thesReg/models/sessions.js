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

module.exports = Sessions;