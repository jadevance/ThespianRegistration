var registrationsModel = require('../models/registrations.js');
var studentsModel = require('../models/students.js');
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

  // SOLO/DUO/TECH:
  getNewIe: function(request, response) {

  },

  createNewIe: function(request, response) {

  },

  editIe: function(request, response) {

  },

  updateIe: function(request, response) {

  }

};

module.exports = iesController;