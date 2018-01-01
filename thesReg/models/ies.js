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
      db.events.where("is_group=$1 AND id=$2 OR id=$3", [true, 3, 6], function(error, eventOptions) {
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
};

Ies.createNewGroupIe = function(formData, params, callback) {
  db.group_ies.save({event_type_id: formData.group_event_type_id,
      registration_id: params.registrationId,
      piece_title: formData.group_piece_title,
      piece_author: formData.group_piece_author,
      piece_publisher: formData.group_piece_publisher},
    function(error, newGroupIE) {
      if (error || !newGroupIE) {
        callback(error, undefined)
      } else {
        callback(null, newGroupIE)
      }
    })
};

Ies.updateGroupIe = function(formData, params, callback) {
  db.group_ies.save({id: params.groupIeId,
                      event_type_id: formData.group_event_type_id,
                      piece_title: formData.group_piece_title,
                      piece_author: formData.group_piece_author,
                      piece_publisher: formData.group_piece_publisher},
    function(error, updatedGroupIe) {
      if (error || !updatedGroupIe) {
        callback(error, undefined)
      } else {
        callback(null, updatedGroupIe)
      }
    })
};

Ies.deleteGroupIe = function(params, callback) {
  db.group_ies.destroy({id: params.groupIeId}, function(error, deletedIe) {
    if (error || !deletedIe) {
      callback(error, undefined)
    } else {
      callback(null, deletedIe)
    }
  })
};

Ies.getGroupStudents = function(params, callback) {
  db.group_ies_students.where("group_ies_id=$1", [params.groupIeId], function(error, groupStudents) {
    if (error) {
      callback(error, undefined)
    } else {
      callback(null, groupStudents)
    }
  })
};

Ies.updateGroupStudents = function(params, formData, callback) {
  db.group_ies_students.where("id=$1", [params.groupIeId],
    function(error, groupStudents) {
      const add = [];
      const remove = [];
      const formParsed = [];
      const participatingIds = [];

      for (var i=0; i<formData.add_remove_toggle.length; i++) {
        formParsed.push(parseInt(formData.add_remove_toggle[i]))
      }

      for (var i=0; i<groupStudents.length; i++) {
        participatingIds.push(groupStudents[i].student_id)
      }

      for (var i=0; i<formParsed.length; i++) {
        if (!_.includes(participatingIds, formParsed[i])) {
          add.push(formParsed[i])
        }
      }

      for (var i=0; i<participatingIds.length; i++) {
        if (!_.includes(formParsed, participatingIds[i])) {
          remove.push(participatingIds[i])
        }
      }

      var registerStudentPromises = [];
      for (var i=0; i<add.length; i++) {
        (function(i) {
          var promise = new Promise(function(resolve, reject) {
            db.group_ies_students.save({group_ies_id: params.groupIeId,
                                        student_id: add[i]},
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
              db.group_ies_students.destroy({group_ies_id: params.groupIeId,
                                            student_id: remove[j]},
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

      Promise.all(registerStudentPromises).then(
        function() {
          callback(null, null)
        },
        function(error) {
          callback(error, undefined)
        }
      )
    }
  )
};

module.exports = Ies;