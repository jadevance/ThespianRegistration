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

Ies.createNewIe = function(formData, params, callback) {
  db.solo_duo_ies.save({event_type_id: formData.event_type_id,
                        registration_id: params.registrationId,
                        primary_student_id: params.studentId,
                        secondary_student_id: formData.secondary_student_id,
                        piece_title: formData.piece_title,
                        piece_author: formData.piece_author,
                        piece_publisher: formData.piece_publisher},
  function(error, newIE) {
    if (error || !newIE) {
      callback(error, undefined)
    } else {
      callback(null, newIE)
    }
  })
};

module.exports = Ies;