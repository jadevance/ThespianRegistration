var app = require('../app.js');
var db = app.get('db');

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
      callback(error, undefined)
    } else {
      callback(null, conference)
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