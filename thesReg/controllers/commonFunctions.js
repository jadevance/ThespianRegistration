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
      isEditing: true
    }

    return room;
  }
};

module.exports = commonFunctions;