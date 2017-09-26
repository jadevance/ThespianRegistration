var express = require('express');
var router = express.Router();
var conferencesController = require('../controllers/conferences.js');

router.get('/conferences', conferencesController.getAllConferences);

module.exports = router;