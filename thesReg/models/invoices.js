var app = require('../app.js');
var db = app.get('db');
var Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');
var common = require('../controllers/commonFunctions.js');

var Invoices = function() {};

Invoices.createNewInvoice = function(user, params, thespianData, callback) {
  db.invoices.save({teacher_id: user.id,
                  school_id: user.school_id,
                  conference_id: params.conferenceId,
                  registration_id: params.registrationId,
                  total_thespians: thespianData.thespians,
                  total_non_thespians: thespianData.nonThespians,
                  total_cost: thespianData.overallTotal},
    function(error, newInvoice) {
      if (error || !newInvoice) {
        callback(error, undefined)
      } else {
        callback(null, newInvoice)
      }
  })
};

Invoices.getAllUserInvoices = function(userId, callback) {
  db.invoices.find({teacher_id: userId}, function(error, invoices) {
    if (error) {
      callback(error, undefined)
    } else {
      var invoicePromises = [];
      for (var i=0; i<invoices.length; i++) {
        (function(i) {
          var promise = new Promise(function(resolve, reject) {
            db.conferences.findOne({id: invoices[i].conference_id},
            function(error, conference) {
              if (error) {
                reject(error)
              } else {
                invoices[i].conference_title = conference.title;
                resolve()
              }
            })
          })
          invoicePromises.push(promise)
        })(i)
      }

      Promise.all(invoicePromises).then(
        function() {
          callback(null, invoices)
        },
        function(error) {
          callback(error, undefined)
        }
      )
    }
  })
};

Invoices.getSingleInvoice = function(invoiceId, callback) {
  db.invoices.find({id: invoiceId}, function(error, invoice) {
    if (error) {
      callback(error, undefined)
    } else {
      callback(null, invoice)
    }
  })
};

module.exports = Invoices;
