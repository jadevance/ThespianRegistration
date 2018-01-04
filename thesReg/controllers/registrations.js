var registrationsModel = require('../models/registrations.js');
var studentsModel = require('../models/students.js');
var iesModel = require('../models/ies.js');
var invoicesModel = require('../models/invoices.js');

var RegistrationsController = {

  createNewRegistration: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      registrationsModel.createNewRegistration(request.user.id, request.params.conferenceId, function (error, registration, conference) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error saving registration";
          response.json(err)
        } else {
          studentsModel.getAllUsersStudents(request.user.id, function(error, students) {
            if (error) {
              var err = new Error;
              err.status = 500;
              err.error = "Error saving registration";
              response.json(err)
            } else {
              response.render('registration', {
                user: request.user,
                loggedIn: loggedIn,
                isAddingOrRemoving: false,
                conference: conference,
                registration: registration,
                students: students,
                registered_students: []
              })
            }
          })
        }
      })
    } else {
      response.redirect('/')
    }
  },

  editRegistration: function(request, response) {
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
              err.error = "Error all students";
              response.json(err)
            } else {
              registrationsModel.getRegisteredStudents(request.user.id, request.params.registrationId, function(error, registeredStudents) {

                if (error) {
                  var err = new Error;
                  err.status = 500;
                  err.error = "Error getting registered students";
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

                  registeredStudents.sort(function (a, b) {
                    var nameA = a.last_name.toUpperCase();
                    var nameB = b.last_name.toUpperCase();
                    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
                  })

                  iesModel.getRegistrationsGroupIEs(request.params.registrationId, function (error, groupEvents, eventOptions) {
                    if (error) {
                      var err = new Error;
                      err.status = 500;
                      err.error = "Error getting group events";
                      response.json(err)
                    } else {
                      iesModel.getAllGroupStudents(groupEvents, function(error, groupStudentsArray) {
                        if (error) {
                          var err = new Error;
                          err.status = 500;
                          err.error = "Error getting group's students";
                          response.json(err)
                        } else {
                          for (var i = 0; i<groupEvents.length; i++) {
                            groupEvents[i].showParticipatingStudents = false;

                            for (var j = 0; j<groupStudentsArray.length; j++) {
                              if (groupStudentsArray[j].length !== 0) {
                                if (groupEvents[i].id == groupStudentsArray[j][0].group_ies_id) {
                                  groupEvents[i].participatingStudents = groupStudentsArray[j]
                                }
                              }
                            }

                            if (!groupEvents[i].participatingStudents) {
                              groupEvents[i].participatingStudents = []
                            }
                          }

                          response.render('registration', {
                            user: request.user,
                            loggedIn: loggedIn,
                            isAddingOrRemoving: false,
                            conference: conference,
                            registration: registration,
                            students: students,
                            registered_students: registeredStudents,
                            group_events: groupEvents,
                            group_options: eventOptions
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
      })
    } else {
      response.redirect('/')
    }
  },

  addOrRemoveStudents: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      studentsModel.getAllUsersStudents(request.user.id, function(error, students) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error getting students";
          response.json(err)
        } else {
          registrationsModel.getRegistration(request.params.registrationId, function(error, registration, conference, registeredStudents) {
            if (error) {
              var err = new Error;
              err.status = 500;
              err.error = "Error getting registered students";
              response.json(err)
            } else {

              for (var i=0; i<students.length; i++) {
                for (var j=0; j<registeredStudents.length; j++) {
                  if (students[i].id == registeredStudents[j].student_id) {
                    students[i].registered = true;
                  }
                }
              }

              response.render('registration', {
                user: request.user,
                loggedIn: loggedIn,
                isAddingOrRemoving: true,
                conference: conference,
                registration: registration,
                registered_students: registeredStudents,
                students: students
              })
            }
          })
        }
      })
    } else {
      response.redirect('/')
    }
  },

  saveAddOrRemoveStudents: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      registrationsModel.updateRegisteredStudents(request.user.id, request.params.registrationId, request.body, function(error, updatedRegisteredStudents) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error saving student registration";
          response.json(err)
        } else {
          response.redirect('/conferences/' + request.params.conferenceId + '/registration/' + request.params.registrationId + '/edit');
        }
      })
    } else {
      response.redirect('/')
    }
  },

  submitRegistration: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      registrationsModel.submitRegistration(request.user, request.params, request.body, function(error, completeRegistration) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error submitting registration";
          response.json(err)
        } else {
          studentsModel.getAllUsersStudents(request.user.id, function(error, students) {
            if (error) {
              var err = new Error;
              err.status = 500;
              err.error = "Error getting all students";
              response.json(err)
            } else {
              registrationsModel.getRegisteredStudents(request.user.id, request.params.registrationId, function(error, registeredStudents) {
                if (error) {
                  var err = new Error;
                  err.status = 500;
                  err.error = "Error getting registered students";
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

                  var thespians = 0;
                  var nonThespians = 0;

                  for (var i=0; i<registeredStudents.length; i++) {
                    if (registeredStudents[i].thespian_status) {
                      thespians++
                    } else {
                      nonThespians++
                    }
                  }

                  var thespianTotal = (thespians * 30);
                  var nonThespianTotal = (nonThespians * 40);
                  var overallTotal = (thespianTotal + nonThespianTotal);

                  var thespiansData = {
                    thespians: thespians,
                    nonThespians: nonThespians,
                    overallTotal: overallTotal
                  };

                  invoicesModel.createNewInvoice(request.user, request.params, thespiansData, function(error, newInvoice) {
                    if (error) {
                      var err = new Error;
                      err.status = 500;
                      err.error = "Error creating invoice";
                      response.json(err)
                    } else {
                      response.redirect('/invoices/' + newInvoice.id)
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
  }
};

module.exports = RegistrationsController;