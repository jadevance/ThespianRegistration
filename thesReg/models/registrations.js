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
          db.registered_students.where("teacher_id=$1 AND registration_id=$2", [registration.teacher_id, registration.id], function(error, students) {
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
  const currentYear = moment().subtract(1, 'years').format('YYYY');
  db.registrations.where("teacher_id=$1 AND conference_year>=$2", [userId, currentYear], function(error, registrations) {
    if (error) {
      callback(error, undefined)
    } else if (!registrations) {
      callback(null, null)
    } else {
      callback(null, registrations)
    }
  })
};

Registrations.getRegisteredStudents = function(userId, registrationId, callback) {
  db.registered_students.find({teacher_id: userId,
                                registration_id: registrationId},
    function(error, registeredStudents) {
      if (error) {
        callback(error, undefined)
      } else {
        var promisesGetIE = [];
        for (var i=0; i<registeredStudents.length; i++) {
          (function(i) {
            var promise = new Promise(function(resolve, reject) {
              db.solo_duo_ies.where("registration_id=$1 AND primary_student_id=$2 OR secondary_student_id=$2", [registrationId, registeredStudents[i].student_id], function(error, events) {
                if (error) {
                  reject(error)
                } else {
                  db.group_ies_students.where("registration_id=$1 AND student_id=$2", [registrationId, registeredStudents[i].student_id], function(error, groupEvents) {
                    if (error) {
                      reject(error)
                    } else {
                      db.events.where("is_group=$1 AND id<$2", [false, 13], function(error, eventOptions) {
                        if (error) {
                          reject(error)
                        } else {
                          registeredStudents[i].events = events;
                          registeredStudents[i].options = eventOptions;

                          if (groupEvents.length !== 0) {
                            registeredStudents[i].events.concat(groupEvents)
                          }
                          resolve()
                        }
                      })
                    }
                  })
                }
              })
            })
            promisesGetIE.push(promise)
          })(i)
        }

        Promise.all(promisesGetIE).then(
          function() {
            callback(null, registeredStudents)
          },
          function(error) {
            callback(error, undefined)
          }
        )
      }
    }
  )
};

Registrations.updateRegisteredStudents = function(userId, registrationId, formData, callback) {
  db.registered_students.find({teacher_id: userId,
                               registration_id: registrationId},
    function(error, registeredStudents) {
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

      var registerStudentPromises = [];
      for (var i=0; i<add.length; i++) {
        (function(i) {
          var promise = new Promise(function(resolve, reject) {
            db.registered_students.save({teacher_id: userId,
                                         student_id: add[i],
                                         registration_id: registrationId,
                                         },
            function(error, registered_student) {
              if (error) {
                reject(error)
              } else {
                resolve()
              }
            })
          })
          registerStudentPromises.push(promise)
        })(i)
      }

      for (var j=0; j<remove.length; j++) {
        (function(j) {
          var promise = new Promise(function(resolve, reject) {
            db.registered_students.destroy({teacher_id: userId,
                                            student_id: remove[j],
                                            registration_id: registrationId},
              function(error, deleted_student) {
                if (error) {
                  reject(error)
                } else {
                  resolve()
                }
              })
            })
            registerStudentPromises.push(promise)
          }
        )(j)
      }

      // To delete IEs from students who unregister
      for (var k=0; k<remove.length; k++) {
        (function(k) {
          var primaryPromise = new Promise(function(resolve, reject) {
            db.solo_duo_ies.destroy({registration_id: registrationId,
                                      primary_student_id: remove[k]},
            function(error, deletedPrimaryRecords) {
              if (error) {
                reject(error)
              } else {
                resolve()
              }
            })
          })
          registerStudentPromises.push(primaryPromise);

          var secondaryPromise = new Promise(function(resolve, reject) {
            db.solo_duo_ies.destroy({registration_id: registrationId,
                                      secondary_student_id: remove[k]},
            function(error, deletedSecondaryRecords) {
              if (error) {
                reject(error)
              } else {
                resolve()
              }
            })
          })
          registerStudentPromises.push(secondaryPromise);

          var tertiaryPromise = new Promise(function(resolve, reject) {
            db.group_ies_students.destroy({registration_id: registrationId,
                                            student_id: remove[k]},
            function(error, deletedTertiaryRecords) {
              if (error) {
                reject(error)
              } else {
                resolve()
              }
            })
          })
          registerStudentPromises.push(tertiaryPromise)

        })(k)
      }

      Promise.all(registerStudentPromises).then(
        function() {
          callback(null, registeredStudents)
        },
        function(error) {
          callback(error, undefined)
        }
      )
    }
  )
};

Registrations.submitRegistration = function(user, params, formData, callback) {
  db.registrations.save({id: params.registrationId,
                        status: 'submitted'}, function(error, completeRegistration) {
    if (error) {
      callback(error, undefined)
    } else {
      callback(null, completeRegistration)
    }
  })
};

module.exports = Registrations;
