var app = require('../app.js');
var db = app.get('db');

var commonFunctions = {
  getYear: function() {
    var now = new Date().getFullYear();
    const yearOptions = [now];

    for (i=0; i<4; i++) {
      now += 1;
      yearOptions.push(now);
    }
    return yearOptions;
  },

  getEmptyConference: function() {
    var conference = {
      id: null,
      title: null,
      year: null,
      registration_status: null,
      location_name: null,
      location_address: null,
      location_city: null,
      location_state: null,
      location_zip: null
    }

    return conference;
  },

  getEmptySession: function() {
    var session = {
      id: null,
      conference_id: null,
      start_time: null,
      end_time: null,
      rooms: [commonFunctions.getEmptyRoom()]
    }

    return session;
  },

  getEmptyRoom: function() {
    var room = {
      id: null,
      conference_id: null,
      session_id: null,
      event_type_id: null,
      room_name: null,
      max_allowed: null,
      events: [],
      isEditing: true
    };
    return room;
  },

  getEmptyStudent: function(teacher) {
    var student = {
      id: null,
      teacher_id: teacher.id,
      schoolId: teacher.school_id,
      first_name: null,
      last_name: null,
      graduation_year: null,
      thespian_status: null,
      isEditing: true
    };
    return student;
  },

  getEmptyIE: function(registrationId, primaryStudentId) {
    var IE = {
      id: null,
      event_type_id: null,
      registration_id: registrationId,
      primary_student_id: primaryStudentId,
      secondary_student_id: null,
      piece_title: null,
      piece_author: null,
      piece_publisher: null,
      isEditing: true
    };

    return IE;
  },

  getEmptyGroupIE: function(registrationId) {
    var groupIE = {
      id: null,
      event_type_id: null,
      registration_id: registrationId,
      secondary_student_id: null,
      piece_title: null,
      piece_author: null,
      piece_publisher: null,
      isEditing: true
    };

    return groupIE;
  }
};

module.exports = commonFunctions;