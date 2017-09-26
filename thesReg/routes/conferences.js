var express = require('express');
var router = express.Router();
var conferencesController = require('../controllers/conferences.js');

// router.get('/conferences', conferencesController.getAllConferences);

router.get('/conferences/new', conferencesController.newConferenceForm);
router.post('/conferences/new', conferencesController.createNewConference);

router.get('/conferences/:conferenceId', conferencesController.getSingleConference);
router.get('/conferences/:conferenceId/edit', conferencesController.editConference);
router.post('/conferences/:conferenceId/edit', conferencesController.updateConference);

module.exports = router;