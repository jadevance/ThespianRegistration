var express = require('express');
var router = express.Router();
var invoicesController = require('../controllers/invoices.js');

// All invoices by user
router.get('/invoices', invoicesController.getAllUserInvoices);

// Single invoice
router.get('/invoices/:invoiceId', invoicesController.getSingleInvoice);

// Print/Download invoice
router.get('/invoices/:invoiceId/print', invoicesController.printInvoice);
router.get('/invoices/:invoiceId/download', invoicesController.downloadInvoice);


module.exports = router;