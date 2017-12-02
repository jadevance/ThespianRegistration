var iesModel = require('../models/ies.js');

var iesController = {

  getStudentIes: function(request, response) {
    iesModel.getStudentIes(request.params.registrationId, request.params.studentId, function(error, ies) {
      if (error) {
        var err = new Error;
        err.status = 500;
        err.error = "Error getting ies";
        response.json(err)
      } else {

      }
    })
  },

  // SOLO:
  getNewSolo: function(request, response) {

  },

  createNewSolo: function(request, response) {

  },

  editSolo: function(request, response) {

  },

  updateSolo: function(request, response) {

  },

  // DUO:
  getNewDuo: function(request, response) {

  },

  createNewDuo: function(request, response) {

  },

  editDuo: function(request, response) {

  },

  updateDuo: function(request, response) {

  },

  // TECH:
  getNewTech: function(request, response) {

  },

  createNewTech: function(request, response) {

  },

  editTech: function(request, response) {

  },

  updateTech: function(request, response) {

  },

};

module.exports = iesController;