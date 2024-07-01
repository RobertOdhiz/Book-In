import express from 'express';
import UsersController from '../controllers/UsersController';
import EventsController from '../controllers/EventsController';

const router = express.Router();

/* User Authentication and Management */
router.post('/register', UsersController.postRegisterUser);
router.post('/login', UsersController.postUserLogin);
router.post('/logout', UsersController.postUserLogout);
router.get('/profile', UsersController.getUserProfile);
router.put('/profile', UsersController.updateUserProfile);

/* Event Management */
router.post('/events', EventsController.postCreateEvent);
router.get('/events', EventsController.getEvents);
router.get('/events/:event_id', EventsController.getEventById);
router.put('/events/:event_id', EventsController.updateEventById);
router.delete('/events/:event_id', EventsController.deleteEventById);

/* Event Registration */
router.post('/events/:event_id/register', EventsController.registerUserForEvent);
router.delete('/events/:event_id/register', EventsController.unregisterUserFromEvent);
router.get('/events/:event_id/attendees', EventsController.getEventAttendees);

export default router;