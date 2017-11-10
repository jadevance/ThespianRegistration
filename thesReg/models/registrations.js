var app = require('../app.js');
var db = app.get('db');

var Registrations = function() {};

Registrations.getUserRegistrations = function(userId, callback) {
  db.registration.find({teacher_id: userId}, function(error, registrations) {
    if (error) {
      callback(error, undefined)
    } else if (!registrations) {
      callback(null, null)
    } else {
      callback(null, registrations)
    }
  })
}

module.exports = Registrations;
