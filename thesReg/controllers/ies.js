var registrationsModel = require('../models/registrations.js');
var studentsModel = require('../models/students.js');
var iesModel = require('../models/ies.js');
var commonFunctions = require('../controllers/commonFunctions.js');

var iesController = {

  getStudentIes: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      registrationsModel.getRegistration(request.params.registrationId, function(error, registration, conference, students) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error getting registration";
          response.json(err)
        } else {
          studentsModel.getAllUsersStudents(request.user.id, function(error, students) {
            if (error) {
              var err = new Error;
              err.status = 500;
              err.error = "Error saving registration";
              response.json(err)
            } else {
              registrationsModel.getRegisteredStudents(request.user.id, request.params.registrationId, function(error, registeredStudents) {
                if (error) {
                  err.status = 500;
                  err.error = "Error getting registration";
                  response.json(err)
                } else {
                  for (var i = 0; i < students.length; i++) {
                    for (var j = 0; j < registeredStudents.length; j++) {
                      if (students[i].id == registeredStudents[j].student_id) {
                        registeredStudents[j].first_name = students[i].first_name;
                        registeredStudents[j].last_name = students[i].last_name;
                        registeredStudents[j].graduation_year = students[i].graduation_year;
                        registeredStudents[j].thespian_status = students[i].thespian_status;
                      }
                    }
                  }

                  for (var i = 0; i < registeredStudents.length; i++) {
                    if (registeredStudents[i].student_id == request.params.studentId) {
                      registeredStudents[i].show_events = true;
                    }
                  }

                  registeredStudents.sort(function (a, b) {
                    var nameA = a.last_name.toUpperCase();
                    var nameB = b.last_name.toUpperCase();
                    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
                  });

                  iesModel.getRegistrationsGroupIEs(request.params.registrationId, function (error, groupEvents) {
                    if (error) {
                      var err = new Error;
                      err.status = 500;
                      err.error = "Error getting group events";
                      response.json(err)
                    } else {
                      response.render('registration', {
                        user: request.user,
                        loggedIn: loggedIn,
                        isAddingOrRemoving: false,
                        conference: conference,
                        registration: registration,
                        students: students,
                        registered_students: registeredStudents,
                        group_events: groupEvents
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  },

  // SOLO/DUO/TECH:
  getNewIe: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      registrationsModel.getRegistration(request.params.registrationId, function(error, registration, conference, students) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error getting registration";
          response.json(err)
        } else {
          studentsModel.getAllUsersStudents(request.user.id, function(error, students) {
            if (error) {
              var err = new Error;
              err.status = 500;
              err.error = "Error saving registration";
              response.json(err)
            } else {
              registrationsModel.getRegisteredStudents(request.user.id, request.params.registrationId, function(error, registeredStudents) {
                if (error) {
                  err.status = 500;
                  err.error = "Error getting registration";
                  response.json(err)
                } else {
                  for (var i = 0; i < students.length; i++) {
                    for (var j = 0; j < registeredStudents.length; j++) {
                      if (students[i].id == registeredStudents[j].student_id) {
                        registeredStudents[j].first_name = students[i].first_name;
                        registeredStudents[j].last_name = students[i].last_name;
                        registeredStudents[j].graduation_year = students[i].graduation_year;
                        registeredStudents[j].thespian_status = students[i].thespian_status;
                      }
                    }
                  }

                  for (var i = 0; i < registeredStudents.length; i++) {
                    if (registeredStudents[i].student_id == request.params.studentId) {
                      registeredStudents[i].show_events = true;
                      var emptyIe = commonFunctions.getEmptyIE(request.params.registrationId, request.params.studentId);
                      registeredStudents[i].events.push(emptyIe)
                    }
                  }

                  registeredStudents.sort(function (a, b) {
                    var nameA = a.last_name.toUpperCase();
                    var nameB = b.last_name.toUpperCase();
                    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
                  });

                  iesModel.getRegistrationsGroupIEs(request.params.registrationId, function (error, groupEvents) {
                    if (error) {
                      var err = new Error;
                      err.status = 500;
                      err.error = "Error getting group events";
                      response.json(err)
                    } else {
                      response.render('registration', {
                        user: request.user,
                        loggedIn: loggedIn,
                        isAddingOrRemoving: false,
                        conference: conference,
                        registration: registration,
                        students: students,
                        registered_students: registeredStudents,
                        group_events: groupEvents
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    } else {
      response.redirect('/')
    }
  },

  createNewIe: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      iesModel.createNewIe(request.body, request.params, function(error, newIE) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error saving IE";
          response.json(err)
        } else {
          response.redirect('/conferences/' + request.params.conferenceId + '/registration/' + request.params.registrationId + '/student/' + request.params.studentId + '/ies')
        }
      })
    } else {
      response.redirect('/')
    }
  },

  editIe: function(request, response) {
    const editing = request.params.ieId;
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      registrationsModel.getRegistration(request.params.registrationId, function(error, registration, conference, students) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error getting registration";
          response.json(err)
        } else {
          studentsModel.getAllUsersStudents(request.user.id, function(error, students) {
            if (error) {
              var err = new Error;
              err.status = 500;
              err.error = "Error saving registration";
              response.json(err)
            } else {
              registrationsModel.getRegisteredStudents(request.user.id, request.params.registrationId, function(error, registeredStudents) {
                if (error) {
                  err.status = 500;
                  err.error = "Error getting registration";
                  response.json(err)
                } else {
                  for (var i = 0; i < students.length; i++) {
                    for (var j = 0; j < registeredStudents.length; j++) {
                      if (students[i].id == registeredStudents[j].student_id) {
                        registeredStudents[j].first_name = students[i].first_name;
                        registeredStudents[j].last_name = students[i].last_name;
                        registeredStudents[j].graduation_year = students[i].graduation_year;
                        registeredStudents[j].thespian_status = students[i].thespian_status;
                      }
                    }
                  }

                  for (var i = 0; i < registeredStudents.length; i++) {
                    if (registeredStudents[i].student_id == request.params.studentId) {
                      registeredStudents[i].show_events = true;
                      for (var j = 0; j < registeredStudents[i].events.length; j++) {
                        if (registeredStudents[i].events[j].id == request.params.ieId) {
                          registeredStudents[i].events[j].isEditing = true
                        }
                      }
                    }
                  }

                  registeredStudents.sort(function (a, b) {
                    var nameA = a.last_name.toUpperCase();
                    var nameB = b.last_name.toUpperCase();
                    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
                  });

                  iesModel.getRegistrationsGroupIEs(request.params.registrationId, function (error, groupEvents) {
                    if (error) {
                      var err = new Error;
                      err.status = 500;
                      err.error = "Error getting group events";
                      response.json(err)
                    } else {
                      response.render('registration', {
                        user: request.user,
                        loggedIn: loggedIn,
                        isAddingOrRemoving: false,
                        conference: conference,
                        registration: registration,
                        students: students,
                        registered_students: registeredStudents,
                        group_events: groupEvents
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  },

  updateIe: function(request, response) {

  }

};

module.exports = iesController;