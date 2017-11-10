var app = require('../app.js');
var db = app.get('db');
var Promise = require('bluebird');
var common = require('../controllers/commonFunctions.js');

var Registrations = function() {};

Registrations.getUserRegistrations = function(userId, callback) {
  db.registration.find({teacher_id: userId}, function(error, registrations) {
    if (error) {
      callback(error, undefined)
    } else if (!registrations) {
      callback(null, null)
    } else {
      var registrationPromises = [];
      for (var i=0; i<registrations.length; i++) {
        (function(i, registrations) {
          var promise = new Promise(function(resolve, reject) {
            db.conferences.find({id: registrations[i].conference_id}, function(error, conference) {
              if (error) {
                reject(error)
              } else {
                registrations[i].ableToRegister = conference.registration_status;
                resolve()
              }
            })
          })
          registrationPromises.push(promise)
        })(i, registrations)
      }

      Promise.all(registrationPromises).then(
        function() {
          callback(null, registrations)
        },
        function(error) {
          callback(error, undefined)
        }
      )
    }
  })
}

module.exports = Registrations;
