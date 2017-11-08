var roomsModel = require('../models/rooms.js');
var conferencesModel = require('../models/conferences');
var common = require('./commonFunctions.js');

var RoomsController = {

  showRooms: function(request, response) {
    const loggedIn = request.isAuthenticated();
    if (loggedIn && (request.user.user_level === 1)) {
      conferencesModel.getSingleConference(request.params.conferenceId, function(error, conference, sessions) {

        for (var i=0; i<sessions.length; i++) {
          if (sessions[i].id == request.params.sessionId) {
            sessions[i].show_rooms = true;

            var roomsArray = sessions[i].rooms;
            for (var j=0; j<roomsArray.length; j++) {
              sessions[i].rooms[j].isEditing = false;
            }
          } else {
            sessions[i].show_rooms = false;
          }
        }

        if(error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error getting conference to add session";
          response.json(err)
        } else {
          response.render('conferences', {
            loggedIn: loggedIn,
            user: request.user,
            isNewConference: false,
            editingConference: false,
            isNewSession: true,
            editingSession: true,
            conference: conference,
            sessions: sessions,
            params: request.params,
            yearOptions: common.getYear()
          })
        }
      })
    } else {
      response.redirect('/')
    }
  },

  newRoomsForm: function(request, response) {
    const loggedIn = request.isAuthenticated();
    if (loggedIn && (request.user.user_level === 1)) {
      conferencesModel.getSingleConference(request.params.conferenceId, function(error, conference, sessions) {

        for (var i=0; i<sessions.length; i++) {
          if (sessions[i].id == request.params.sessionId) {
            sessions[i].show_rooms = true;

            var roomsArray = sessions[i].rooms;
            var eventsArray;
            if ((roomsArray.length > 1) || (roomsArray[0].id !== null)) {
              eventsArray = roomsArray[0].events;
              sessions[i].rooms.push(common.getEmptyRoom());
            }

            for (var j=0; j<roomsArray.length; j++) {
              if (roomsArray[j].id === null) {
                sessions[i].rooms[j].isEditing = true;
                if (sessions[i].rooms[j].events.length === 0) {
                  sessions[i].rooms[j].events = eventsArray;
                }
              } else {
                sessions[i].rooms[j].isEditing = false;
              }
            }

          } else {
            sessions[i].show_rooms = false;
          }
        }

        if(error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error getting conference to add session";
          response.json(err)
        } else {
          response.render('conferences', {
            loggedIn: loggedIn,
            user: request.user,
            isNewConference: false,
            editingConference: false,
            isNewSession: true,
            editingSession: true,
            conference: conference,
            sessions: sessions,
            params: request.params,
            yearOptions: common.getYear()
          })
        }
      })
    } else {
      response.redirect('/')
    }
  },

  createNewRoom: function(request, response) {
    const loggedIn = request.isAuthenticated();
    if (loggedIn && (request.user.user_level === 1)) {
      roomsModel.createNewRoom(request.body, request.params, function(error, room) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error saving room";
          response.json(err)
        } else {
          response.redirect('/conferences/' + request.params.conferenceId + '/sessions/' + request.params.sessionId + '/rooms')
        }
      })
    } else {
      response.redirect('/')
    }
  },

  editRoom: function(request, response) {
    const loggedIn = request.isAuthenticated();
    if (loggedIn && (request.user.user_level === 1)) {
      conferencesModel.getSingleConference(request.params.conferenceId, function(error, conference, sessions) {

        for (var i=0; i<sessions.length; i++) {
          if (sessions[i].id == request.params.sessionId) {
            sessions[i].show_rooms = true;

            var roomsArray = sessions[i].rooms;
            for (var j=0; j<roomsArray.length; j++) {
              if (roomsArray[j].id == request.params.roomId) {
                sessions[i].rooms[j].isEditing = true;
              } else {
                sessions[i].rooms[j].isEditing = false;
              }
            }
          } else {
            sessions[i].show_rooms = false;
          }
        }

        if(error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error getting conference to add session";
          response.json(err)
        } else {
          response.render('conferences', {
            loggedIn: loggedIn,
            user: request.user,
            isNewConference: false,
            editingConference: false,
            isNewSession: true,
            editingSession: true,
            conference: conference,
            sessions: sessions,
            params: request.params,
            yearOptions: common.getYear()
          })
        }
      })
    } else {
      response.redirect('/')
    }
  },

  updateRoom: function(request, response) {
    const loggedIn = request.isAuthenticated();
    if (loggedIn && (request.user.user_level === 1)) {
      roomsModel.updateRoom(request.body, request.params, function(error, room) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error saving session";
          response.json(err)
        } else {
          response.redirect('/conferences/' + request.params.conferenceId + '/sessions/' + request.params.sessionId + '/rooms')
        }
      })
    } else {
      response.redirect('/')
    }
  },

  deleteRoom: function(request, response) {
    const loggedIn = request.isAuthenticated();
    if (loggedIn && (request.user.user_level === 1)) {
      roomsModel.deleteRoom(request.params.roomId, function(error, room) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error deleting session";
          response.json(err)
        } else {
          response.redirect('/conferences/' + request.params.conferenceId)
        }
      })
    } else {
      response.redirect('/')
    }
  }
};

module.exports = RoomsController;