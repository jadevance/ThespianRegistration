var app = require('../app.js');
var db = app.get('db');
var Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');
var common = require('../controllers/commonFunctions.js');

var Ies = function() {};

Ies.getRegistrationsGroupIEs = function(registrationId, callback) {
  db.group_ies.find({registration_id: registrationId}, function(error, groupEvents) {
    if (error) {
      callback(error, undefined)
    } else {
      callback(null, groupEvents)
    }
  })
};

module.exports = Ies;