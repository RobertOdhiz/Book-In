import express from 'express';
import UsersController from '../controllers/UsersController';
import EventsController from '../controllers/EventsController';

const router = express.Router();

/* User Registration */
router.post('/register', UsersController.postUserRegister);
router.get('/users/:id', UsersController.getUser);
router.get('/users', UsersController.getUsers);
router.delete('/users/:id', UsersController.deleteUser);
router.delete('/users/clear/:userId', UsersController.deleteUsersByUserId);

/* Event CRUD */
router.get('/events', EventsController.getEvents);
router.get('/events/:id', EventsController.getEventById);
router.get('/users/:userId/dashboard', EventsController.getEventsByUserId);
router.post('/events', EventsController.postCreateEvent);
router.put('/events/:id', EventsController.updateEventById);
router.put('/events/:id/attendees', EventsController.appendAttendee);
router.delete('/events/:id', EventsController.deleteEventById);

module.exports = router;

