var app = require('../app.js');
var db = app.get('db');
var Promise = require('bluebird');
var moment = require('moment');
var common = require('../controllers/commonFunctions.js');

var Students = function() {};

Students.getAllUsersStudents = function(userId, callback) {
  var currentYear = moment().format('YYYY');
  db.students.find({teacher_id: userId,
                    "graduation_year>=": currentYear},
                  {order: "last_name asc"},
    function(error, students) {
    if (error) {
      callback(error, undefined)
    } else {
      callback(null, students)
    }
  })
};

Students.createNewStudent = function(user, formData, callback) {
  db.students.save({teacher_id: user.id,
                    school_id: user.school_id,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    graduation_year: formData.graduation_year,
                    thespian_status: formData.thespian_status},
  function(error, newStudent) {
    if (error || !newStudent) {
      calback(error, undefined)
    } else {
      callback(null, newStudent)
    }
  })
};

Students.editStudent = function(userId, studentId, callback) {
  var currentYear = moment().format('YYYY');
  db.students.find({teacher_id: userId,
                    "graduation_year>=": currentYear},
                    {order: "last_name asc"},
    function(error, students) {
    if (error) {
      callback(error, undefined)
    } else {
      for (var i = 0; i < students.length; i++) {
        if (students[i].id == studentId) {
          students[i].isEditing = true;
        } else {
          students[i].isEditing = false;
        }
      }
      callback(null, students);
    }
  })
};

Students.updateStudent = function(studentId, formData, callback) {
  db.students.update({id: studentId,
                      first_name: formData.first_name,
                      last_name: formData.last_name,
                      graduation_year: formData.graduation_year,
                      thespian_status: formData.thespian_status},
  function(error, updatedStudent) {
    if (error || !updatedStudent) {
      callback(error, undefined)
    } else {
      callback(null, updatedStudent)
    }
  })
};

module.exports = Students;