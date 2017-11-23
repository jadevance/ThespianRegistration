var studentsModel = require('../models/students.js');
var common = require('../controllers/commonFunctions.js');

var StudentsController = {

  getAllUsersStudents: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      studentsModel.getAllUsersStudents(request.user.id, function(error, students) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error getting students";
          response.json(err)
        } else {
          response.render('students', {
            user: request.user,
            loggedIn: loggedIn,
            students: students
          })
        }
      })
    } else {
      response.redirect('/')
    }
  },

  getNewStudentForm: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      studentsModel.getAllUsersStudents(request.user.id, function(error, students) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error getting students";
          response.json(err)
        } else {
          const newStudent = common.getEmptyStudent(request.user);
          students.push(newStudent);
          response.render('students', {
            user: request.user,
            loggedIn: loggedIn,
            yearOptions: common.getYear(),
            students: students
          })
        }
      })
    } else {
      response.redirect('/')
    }
  },

  createNewStudent: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      studentsModel.createNewStudent(request.user, request.body, function(error, student) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error saving studnet";
          response.json(err)
        } else {
          response.redirect('/students')
        }
      })
    } else {
      response.redirect('/')
    }
  },

  editStudent: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      studentsModel.editStudent(request.user.id, request.params.studentId, function(error, students) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error getting student";
          response.json(err)
        } else {
          response.render('students', {
            user: request.user,
            loggedIn: loggedIn,
            yearOptions: common.getYear(),
            students: students
          })
        }
      })
    } else {
      response.redirect('/')
    }
  },

  updateStudent: function(request, response) {
    studentsModel.updateStudent(request.params.studentId, request.body, function(error, updatedStudent) {
      if (error) {
        var err = new Error;
        err.status = 500;
        err.error = "Error saving student";
        response.json(err)
      } else {
        response.redirect('/students');
      }
    })
  }

};

module.exports = StudentsController;