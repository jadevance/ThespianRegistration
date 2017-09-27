var express = require('express');
var router = express.Router();
var conferencesController = require('../controllers/conferences.js');
var sessionsController = require('../controllers/sessions.js');
var roomsController = require('../controllers/rooms.js');

// router.get('/conferences', conferencesController.getAllConferences);

router.get('/conferences/new', conferencesController.newConferenceForm);
router.post('/conferences/new', conferencesController.createNewConference);

router.get('/conferences/:conferenceId', conferencesController.getSingleConference);
router.get('/conferences/:conferenceId/edit', conferencesController.editConference);
router.post('/conferences/:conferenceId/edit', conferencesController.updateConference);

router.get('/conferences/:conferenceId/sessions/new', sessionsController.newSessionForm);
router.post('/conferences/:conferenceId/sessions/new', sessionsController.createNewSession);

router.get('/conferences/:conferenceId/sessions/:sessionId/edit', sessionsController.editSession);
router.post('/conferences/:conferenceId/sessions/:sessionId/edit', sessionsController.updateSession);
router.get('/conferences/:conferenceId/sessions/:sessionId/delete', sessionsController.deleteSession);

router.get('/conferences/:conferenceId/sessions/:sessionId/rooms', roomsController.showRooms);
router.get('/conferences/:conferenceId/sessions/:sessionId/rooms/new', roomsController.newRoomsForm);
router.post("/conferences/:conferenceId/sessions/:sessionId/rooms/new", roomsController.createNewRoom);

router.get('/conferences/:conferenceId/sessions/:sessionId/rooms/:roomId/edit', roomsController.editRoom);
router.post('/conferences/:conferenceId/sessions/:sessionId/rooms/:roomId/edit', roomsController.updateRoom);
router.get('/conferences/:conferenceId/sessions/:sessionId/rooms/:roomId/delete', roomsController.deleteRoom);




module.exports = router;