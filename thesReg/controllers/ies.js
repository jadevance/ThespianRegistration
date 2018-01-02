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
    }
  },

  updateIe: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      iesModel.updateIe(request.body, request.params, function(error, newIE) {
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

  deleteIe: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      iesModel.deleteIe(request.params, function(error, updatedIes) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error saving IE";
          response.json(err)
        } else {
          if (updatedIes.length > 0) {
            response.redirect('/conferences/' + request.params.conferenceId + '/registration/' + request.params.registrationId + '/student/' + request.params.studentId + '/ies')
          } else {
            response.redirect('/conferences/' + request.params.conferenceId + '/registration/' + request.params.registrationId + '/edit')
          }
        }
      })
    } else {
      response.redirect('/')
    }
  },

  getNewGroupIe: function(request, response) {
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

                  registeredStudents.sort(function (a, b) {
                    var nameA = a.last_name.toUpperCase();
                    var nameB = b.last_name.toUpperCase();
                    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
                  });

                  iesModel.getRegistrationsGroupIEs(request.params.registrationId, function (error, groupEvents, eventOptions) {
                    if (error) {
                      var err = new Error;
                      err.status = 500;
                      err.error = "Error getting group events";
                      response.json(err)
                    } else {
                      var emptyGroupIe = commonFunctions.getEmptyGroupIE(request.params.registrationId);
                      groupEvents.push(emptyGroupIe);

                      iesModel.getGroupStudents(request.params, function(error, groupStudents) {
                        if (error) {
                          var err = new Error;
                          err.status = 500;
                          err.error = "Error getting group's students";
                          response.json(err)
                        } else {
                          for (var i = 0; i<groupEvents.length; i++) {
                            groupEvents[i].showParticipatingStudents = false;

                            var participatingStudents = [];
                            for (var j = 0; j<registeredStudents.length; j++) {
                              for (var k = 0; k<groupStudents.length; k++) {
                                if (registeredStudents[j].student_id == groupStudents[k].student_id) {
                                  participatingStudents.push(registeredStudents[j])
                                }
                              }
                            }

                            groupEvents[i].participatingStudents = participatingStudents;
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

  createNewGroupIe: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      iesModel.createNewGroupIe(request.body, request.params, function(error, newIE) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error saving Group IE";
          response.json(err)
        } else {
          response.redirect('/conferences/' + request.params.conferenceId + '/registration/' + request.params.registrationId + '/edit')
        }
      })
    } else {
      response.redirect('/')
    }
  },

  editGroupIe: function(request, response) {
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

                  registeredStudents.sort(function (a, b) {
                    var nameA = a.last_name.toUpperCase();
                    var nameB = b.last_name.toUpperCase();
                    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
                  });

                  iesModel.getRegistrationsGroupIEs(request.params.registrationId, function (error, groupEvents, eventOptions) {
                    if (error) {
                      var err = new Error;
                      err.status = 500;
                      err.error = "Error getting group events";
                      response.json(err)
                    } else {
                      for (var i = 0; i<groupEvents.length; i++) {
                        if (groupEvents[i].id == request.params.groupIeId) {
                          groupEvents[i].isEditing = true;
                        }
                      }

                      iesModel.getGroupStudents(request.params, function(error, groupStudents) {
                        if (error) {
                          var err = new Error;
                          err.status = 500;
                          err.error = "Error getting group's students";
                          response.json(err)
                        } else {
                          for (var i = 0; i<groupEvents.length; i++) {
                            groupEvents[i].showParticipatingStudents = false;

                            var participatingStudents = [];
                            for (var j = 0; j<registeredStudents.length; j++) {
                              for (var k = 0; k<groupStudents.length; k++) {
                                if (registeredStudents[j].student_id == groupStudents[k].student_id) {
                                  participatingStudents.push(registeredStudents[j])
                                }
                              }
                            }

                            groupEvents[i].participatingStudents = participatingStudents;
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
    }
  },

  updateGroupIe: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      iesModel.updateGroupIe(request.body, request.params, function(error, newIE) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error saving IE";
          response.json(err)
        } else {
          response.redirect('/conferences/' + request.params.conferenceId + '/registration/' + request.params.registrationId + '/edit')
        }
      })
    } else {
      response.redirect('/')
    }
  },

  deleteGroupIe: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      iesModel.deleteGroupIe(request.params, function(error, deletedIe) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error saving IE";
          response.json(err)
        } else {
          response.redirect('/conferences/' + request.params.conferenceId + '/registration/' + request.params.registrationId + '/edit')
        }
      })
    } else {
      response.redirect('/')
    }
  },

  getGroupStudents: function(request, response) {
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
                  });

                  iesModel.getRegistrationsGroupIEs(request.params.registrationId, function (error, groupEvents, eventOptions) {
                    if (error) {
                      var err = new Error;
                      err.status = 500;
                      err.error = "Error getting group events";
                      response.json(err)
                    } else {
                      iesModel.getGroupStudents(request.params, function(error, groupStudents) {
                        if (error) {
                          var err = new Error;
                          err.status = 500;
                          err.error = "Error getting group's students";
                          response.json(err)
                        } else {
                          for (var i = 0; i<groupEvents.length; i++) {
                            if (groupEvents[i].id == request.params.groupIeId) {
                              groupEvents[i].showParticipatingStudents = true;
                            } else {
                              groupEvents[i].showParticipatingStudents = false;
                            }

                            var participatingStudents = [];
                            for (var j = 0; j<registeredStudents.length; j++) {
                              for (var k = 0; k<groupStudents.length; k++) {
                                if (registeredStudents[j].student_id == groupStudents[k].student_id) {
                                  participatingStudents.push(registeredStudents[j])
                                }
                              }
                            }

                            groupEvents[i].participatingStudents = participatingStudents;
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

  addOrRemoveStudentsToGroup: function(request, response) {
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
                      iesModel.getGroupStudents(request.params, function(error, groupStudents) {
                        if (error) {
                          var err = new Error;
                          err.status = 500;
                          err.error = "Error getting group's students";
                          response.json(err)
                        } else {
                          for (var i = 0; i<groupEvents.length; i++) {
                            var participatingStudents = [];
                            if (groupEvents[i].id == request.params.groupIeId) {
                              groupEvents[i].isAddingOrRemovingGroup = true;

                              for (var j = 0; j<registeredStudents.length; j++) {
                                for (var k = 0; k<groupStudents.length; k++) {
                                  if (registeredStudents[j].student_id == groupStudents[k].student_id) {
                                    registeredStudents[j].participating = true;
                                  }
                                }

                                if (registeredStudents[j].participating === true || registeredStudents[j].events.length < 3) {
                                  participatingStudents.push(registeredStudents[j])
                                }
                              }
                            }

                            if (participatingStudents.length > 0) {
                              groupEvents[i].participatingStudents = participatingStudents;
                            } else {
                              groupEvents[i].participatingStudents = registeredStudents;
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

  saveAddOrRemoveStudentsToGroup: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      iesModel.updateGroupStudents(request.params, request.body, function(error, updatedGroupStudents) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error saving student registration";
          response.json(err)
        } else {
          response.redirect('/conferences/' + request.params.conferenceId + '/registration/' + request.params.registrationId + '/group/' + request.params.groupIeId + '/showStudents');
        }
      })
    } else {
      response.redirect('/')
    }
  }
};

module.exports = iesController;