var express = require('express');
var router = express.Router();
var registrationsController = require('../controllers/registrations.js');

router.post('/conferences/:conferenceId/registration/new', registrationsController.createNewRegistration);

router.get('/conferences/:conferenceId/registration/:registrationId/edit', registrationsController.editRegistration);

module.exports = router;