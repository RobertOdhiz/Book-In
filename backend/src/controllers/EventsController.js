const dbClient = require('../utils/db');
const { ObjectId } = require('mongodb');

class EventsController {
    static async getEvents(req, res) {
        try {
            if (!dbClient.isAlive()) {
                console.log('DB not running');
                return res.status(500).json({ error: 'Database server not connected' });
            }
            const count = await dbClient.db.collection('events').countDocuments();
            const events = await dbClient.db.collection('events').find({}).toArray();

            return res.status(200).json({ events, count });
        } catch (err) {
            console.error('Error in getEvents:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async getEventById(req, res) {
        try {
            const { id } = req.params;
            const event = await dbClient.db.collection('events').findOne({ _id: new ObjectId(id) });

            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }

            return res.status(200).json({ event });
        } catch (err) {
            console.error('Error in getEventById:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async postCreateEvent(req, res) {
        try {
            const { email, attendees, eventId, title, userId, startTime, timeZone, endTime, description, location, status } = req.body;

            if (!req.body) {
                return res.status(400).json({ error: 'Invalid input' });
            }

            if (!dbClient.isAlive()) {
                return res.status(500).json({ error: 'Database server not connected' });
            }

            const checkEvent = await dbClient.db.collection('events').findOne({ eventId });
            if (checkEvent) {
                return res.status(409).json({ error: 'Event already exists' });
            }
            
            const event = {
                email,
                attendees,
                eventId,
                userId,
                title,
                startTime,
                timeZone,
                endTime,
                description,
                location,
                status
            };

            const result = await dbClient.db.collection('events').insertOne(event);

            return res.status(201).json({ message: 'Event created successfully', id: result.insertedId });
        } catch (err) {
            console.error('Error in postCreateEvent:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async updateEventById(req, res) {
        try {
            const { id } = req.params;

            if (!req.body) {
                return res.status(400).json({ error: 'Invalid input' });
            }

            const {
                email,
                attendees,
                eventId,
                title,
                userId,
                startTime,
                timeZone,
                endTime,
                description,
                location,
                status,
                qrCodeDataURL
            } = req.body;

            if (!dbClient.isAlive()) {
                return res.status(500).json({ error: 'Database server not connected' });
            }

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid Event ID' });
            }

            const event = await dbClient.db.collection('events').findOne({ _id: new ObjectId(id) });
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }

            const qrCodeBuffer = qrCodeDataURL ? Buffer.from(qrCodeDataURL.split(',')[1], 'base64') : null; // Convert Data URL to Buffer

            const updateData = {
                email,
                attendees,
                eventId,
                userId,
                title,
                startTime,
                timeZone,
                endTime,
                description,
                location,
                status,
                qrCode: qrCodeBuffer // Add QR Code Buffer to the update data
            };

            await dbClient.db.collection('events').updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            );

            return res.status(200).json({
                ...updateData,
                id
            });
        } catch (err) {
            console.error('Error in updateEventById:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async deleteEventById(req, res) {
        try {
            const { id } = req.params;

            if (!dbClient.isAlive()) {
                return res.status(500).json({ error: 'Database server not connected' });
            }

            const event = await dbClient.db.collection('events').findOne({ _id: new ObjectId(id) });
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }

            await dbClient.db.collection('events').deleteOne({ _id: new ObjectId(id) });

            return res.status(200).json({ message: 'Event deleted' });
        } catch (err) {
            console.error('Error in deleteEventById:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async getEventsByUserId(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            if (!dbClient.isAlive()) {
                return res.status(500).json({ error: 'Database server not connected' });
            }

            const events = await dbClient.db.collection('events').find({ userId }).toArray();

            if (events.length === 0) {
                return res.status(404).json({ error: 'No events found for this user' });
            }

            return res.status(200).json({ events });
        } catch (err) {
            console.error('Error in getEventsByUserId:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async appendAttendee(req, res) {
        try {
            const { id } = req.params;
            const { formData } = req.body;

            if (!formData) {
                return res.status(400).json({ error: 'Invalid input' });
            }

            if (!dbClient.isAlive()) {
                return res.status(500).json({ error: 'Database server not connected' });
            }

            const event = await dbClient.db.collection('events').findOne({ _id: new ObjectId(id) });

            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }

            const updatedAttendees = [...event.attendees, formData]; // Append new attendee data to the existing array

            await dbClient.db.collection('events').updateOne(
                { _id: new ObjectId(id) },
                { $set: { attendees: updatedAttendees } }
            );

            return res.status(200).json({
                message: 'Attendee added successfully',
                attendees: updatedAttendees
            });
        } catch (err) {
            console.error('Error in appendAttendee:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = EventsController;
