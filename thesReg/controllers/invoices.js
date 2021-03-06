var invoicesModel = require('../models/invoices.js');
var pdfMake = require('pdfmake');
var pdfBuild = require('pdfmake/build/pdfmake.js');

var InvoicesController = {

  getAllUserInvoices: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      invoicesModel.getAllUserInvoices(request.user.id, function(error, invoices) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error getting invoices";
          response.json(err)
        } else {
          response.render('invoices', {
            user: request.user,
            loggedIn: loggedIn,
            singleInvoice: false,
            invoices: invoices
          })
        }
      })
    } else {
      response.redirect('/')
    }
  },

  getSingleInvoice: function(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      invoicesModel.getSingleInvoice(request.user, request.params.invoiceId, function(error, invoice) {
        if (error) {
          var err = new Error;
          err.status = 500;
          err.error = "Error getting invoice";
          response.json(err)
        } else {
          response.render('invoices', {
            user: request.user,
            loggedIn: loggedIn,
            singleInvoice: true,
            invoice: invoice
          })
        }
      })
    } else {
      response.redirect('/')
    }
  },

  printInvoice(request, response) {
    const loggedIn = request.isAuthenticated();

    if (loggedIn) {
      var docDefinition = {content: 'This is an sample PDF printed with pdfMake'};
      pdfBuild.createPdf(docDefinition).print();
      //  What the fuck do I render?
    } else {
      response.redirect('/')
    }
  },

  downloadInvoice(request, response) {

  }
};

module.exports = InvoicesController;