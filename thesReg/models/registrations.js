var app = require('../app.js');
var db = app.get('db');
var Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');
var common = require('../controllers/commonFunctions.js');

var Registrations = function() {};

Registrations.createNewRegistration = function(userId, conferenceId, callback) {
  db.conferences.findOne({id: conferenceId}, function(error, conference) {
    if (error) {
      callback(error, undefined)
    } else {
      db.registrations.save({teacher_id: userId,
               conference_id: conference.id,
               conference_year: conference.year,
               status: 'open (not yet submitted)'},
      function (error, newRegistration) {
        if (error || !newRegistration) {
          callback(error, undefined)
        } else {
          callback(null, newRegistration, conference);
        }
      })
    }
  })
};

Registrations.getRegistration = function(registrationId, callback) {
  db.registrations.findOne({id: registrationId}, function(error, registration) {
    if (error) {
      callback(error, undefined, undefined, undefined)
    } else {
      db.conferences.findOne({id: registration.conference_id}, function(error, conference) {
        if (error) {
          callback(error, undefined, undefined, undefined)
        } else {
          db.registered_students.where("teacher_id=$1 AND registration_id>=$2", [registration.teacher_id, registration.id], function(error, students) {
            if (error) {
              callback(error, undefined)
            } else {
              callback(null, registration, conference, students)
            }
          })
        }
      })
    }
  })
};

Registrations.getUserRegistrations = function(userId, callback) {
  const currentYear = moment().format('YYYY');
  db.registrations.where("teacher_id=$1 AND conference_year<=$2", [userId, currentYear], function(error, registrations) {
    if (error) {
      callback(error, undefined)
    } else if (!registrations) {
      callback(null, null)
    } else {
      callback(null, registrations)
    }
  })
};

Registrations.updateRegisteredStudents = function(userId, registrationId, formData, callback) {
  db.registered_students.where("teacher_id=$1 AND registration_id>=$2", [userId, registrationId], function(error, registeredStudents) {
    const add = [];
    const remove = [];
    const formParsed = [];
    const registeredIds = [];

    for (var i=0; i<formData.register.length; i++) {
      formParsed.push(parseInt(formData.register[i]))
    }

    for (var i=0; i<registeredStudents.length; i++) {
      registeredIds.push(registeredStudents[i].student_id)
    }

    for (var i=0; i<formParsed.length; i++) {
      if (!_.includes(registeredIds, formParsed[i])) {
        add.push(formParsed[i])
      }
    }

    for (var i=0; i<registeredIds.length; i++) {
      if (!_.includes(formParsed, registeredIds[i])) {
        remove.push(registeredIds[i])
      }
    }


  })
};

module.exports = Registrations;
