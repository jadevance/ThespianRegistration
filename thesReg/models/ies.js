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
      callback(error, undefined, undefined)
    } else {
      db.events.where("is_group=$1 AND id=$2 OR id=$3", [false, 2, 6], function(error, eventOptions) {
        if (error) {
          callback(error, undefined, undefined)
        } else {
          callback(null, groupEvents, eventOptions)
        }
      })
    }
  })
};

Ies.getStudentIes = function(registrationId, studentId, callback) {
  db.solo_duo_ies.where("primary_student_id=$1 OR secondary_student_id=$1 AND registration_id=$2", [studentId, registrationId], function(error, studentEvents) {
    if (error) {
      callback(error, undefined)
    } else {
      callback(null, studentEvents)
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

Ies.updateIe = function(formData, params, callback) {
  db.solo_duo_ies.save({id: params.ieId,
                        piece_title: formData.piece_title,
                        piece_author: formData.piece_author,
                        piece_publisher: formData.piece_publisher},
  function(error, updatedIe) {
    if (error || !updatedIe) {
      callback(error, undefined)
    } else {
      callback(null, updatedIe)
    }
  })
};

Ies.deleteIe = function(params, callback) {
  db.solo_duo_ies.destroy({id: params.ieId},
    function(error, deletedIe) {
      if (error || !deletedIe) {
        callback(error, undefined)
      } else {
        db.solo_duo_ies.where("primary_student_id=$1 OR secondary_student_id=$1 AND registration_id=$2", [params.studentId, params.registrationId], function(error, ies) {
          if (error) {
            callback(error, undefined)
          } else {
            callback(null, ies)
          }
        })
      }
    }
  )
}

module.exports = Ies;