var app = require('../app.js');
var db = app.get('db');

var Rooms = function() {};

Rooms.createNewRoom = function(formData, params, callback) {
  db.rooms.save({conference_id: params.conferenceId,
                  session_id: params.sessionId,
                  event_type_id: formData.event_type_id,
                  room_name: formData.room_name,
                  max_allowed: formData.max_allowed},
    function(error, newRoom) {
      if (error || !newRoom) {
        callback(error, undefined)
      } else {
        callback(null, newRoom)
      }
    }
  )
};

Rooms.updateRoom = function(formData, params, callback) {
  db.rooms.save({id: params.roomId,
                  event_type_id: formData.event_type_id,
                  room_name: formData.room_name,
                  max_allowed: formData.max_allowed},
    function(error, updatedRoom) {
      if (error || !updatedRoom) {
        callback(error, undefined)
      } else {
        callback(null, updatedRoom)
      }
    }
  )
};

Rooms.deleteRoom = function(roomId, callback) {
  db.rooms.destroy({id: roomId},
    function(error, deletedRoom) {
      if (error || !deletedRoom) {
        callback(error, undefined)
      } else {
        callback(null, deletedRoom)
      }
    }
  )
};

module.exports = Rooms;