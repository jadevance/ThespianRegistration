var app = require('../app.js');
var db = app.get('db');
var Promise = require('bluebird');
var common = require('../controllers/commonFunctions.js');

var Conferences = function() {};

Conferences.getAllConferences = function(callback) {
  db.run('select * from conferences', function(error, conferences) {
    if (error) {
      callback(error, undefined)
    } else if (!conferences) {
      callback(null, null)
    } else {
      callback(null, conferences)
    }
  })
};

Conferences.getSingleConference = function(conferenceId, callback) {
  db.conferences.findOne({id: conferenceId}, function(error, conference) {
    if (error) {
      callback(error, undefined, undefined)
    } else {
      db.sessions.find({conference_id: conference.id}, function(error, sessions) {
        if (error) {
          callback(error, undefined, undefined)
        } else if (sessions.length === 0) {
          sessions = [common.getEmptySession()];
          callback(null, conference, sessions)
        } else {
          db.run("select * from events", function(error, events) {
            var sessionsPromises = [];
            for (var i=0; i<sessions.length; i++) {
              (function(i, events) {
                var promise = new Promise(function(resolve, reject) {
                  db.rooms.find({session_id: sessions[i].id}, function(error, rooms) {
                    if (error) {
                      reject(error)
                    } else {
                      if (rooms.length === 0) {
                        var emptyRoom = common.getEmptyRoom();
                        rooms.push(emptyRoom)
                      }

                      for (var j=0; j<rooms.length; j++) {
                        rooms[j].events = events;
                      }
                      sessions[i].rooms = rooms;
                      resolve()
                    }
                  })
                })
                sessionsPromises.push(promise)
              })(i, events)
            }

            Promise.all(sessionsPromises).then(
              function() {
                callback(null, conference, sessions)
              },
              function(error) {
                callback(error, undefined, undefined)
              }
            )
          })
        }
      }.bind(conference))
    }
  })
};

Conferences.createNewConference = function(formData, callback) {
  db.conferences.save({title: formData.conference_title,
                        year: formData.year,
                        registration_status: formData.registration_status,
                        location_name: formData.location_name,
                        location_address: formData.location_address,
                        location_city: formData.location_city,
                        location_state: 'WA',
                        location_zip: formData.location_zip},
    function(error, newConference) {
      if (error || !newConference) {
        callback(error, undefined)
      } else {
        callback(null, newConference)
      }
    }
  )
};

Conferences.updateConference = function(conferenceId, formData, callback) {
  db.conferences.findOne({id: conferenceId}, function(error, conference) {
    if (error || !conference) {
      callback(error, undefined)
    } else {
      db.conferences.save({id: conference.id,
                            title: formData.conference_title,
                            year: formData.year,
                            registration_status: formData.registration_status,
                            location_name: formData.location_name,
                            location_address: formData.location_address,
                            location_city: formData.location_city,
                            location_state: 'WA',
                            location_zip: formData.location_zip },
      function(error, updatedConference) {
        if (error || !updatedConference) {
          callback(error, undefined)
        } else {
          callback(null, updatedConference)
        }
      })
    }
  })
};

module.exports = Conferences;