import express from 'express';
import UsersController from '../controllers/UsersController';
import EventsController from '../controllers/EventsController';

const router = express.Router();

/* User Registration */
router.post('/register', UsersController.postUserRegister);
router.post('/get-me', UsersController.getMe);

/* Event CRUD */
router.get('/events', EventsController.getEvents);
router.get('/events/:id', EventsController.getEventById);
router.post('/events', EventsController.postCreateEvent);
router.put('/events/:id', EventsController.updateEventById);
router.delete('/events/:id', EventsController.deleteEventById);

module.exports = router;

