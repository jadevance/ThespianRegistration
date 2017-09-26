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

module.exports = Conferences;