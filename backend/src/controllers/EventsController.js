const dbClient = require('../utils/db');
const { ObjectId } = require('mongodb');

class EventsController {
    static async getEvents(req, res) {
        if (!dbClient.isAlive()) {
            console.log('DB not running');
            return res.status(500).json({ error: 'Database server not connected' });
        }
        const count = await dbClient.db.collection('events').countDocuments();
        const events = await dbClient.db.collection('events').find({}).toArray();

        return res.status(200).json({ events, count });
    }

    static async getEventById(req, res) {
        const { id } = req.params;
        const eventId = id;
        const event = await dbClient.db.collection('events').findOne({ eventId });
        return res.status(200).json({ event });
    }

    static async postCreateEvent(req, res) {
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
    }

    static async updateEventById(req, res) {
        let { id } = req.params;
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
    }

    static async deleteEventById(req, res) {
        const { id } = req.params;

        if (!dbClient.isAlive()) {
            return res.status(500).json({ error: 'Database server not connected' });
        }

        const event = await dbClient.db.collection('events').findOne({ _id: ObjectId.createFromHexString(id) });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        await dbClient.db.collection('events').deleteOne({ _id: ObjectId.createFromHexString(id) });

        return res.status(200).json({ message: 'Event deleted' });
    }

    static async getEventsByUserId(req, res) {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        if (!dbClient.isAlive()) {
            return res.status(500).json({ error: 'Database server not connected' });
        }

        try {
            const events = await dbClient.db.collection('events').find({ userId: userId }).toArray();

            if (events.length === 0) {
                return res.status(404).json({ error: 'No events found for this user' });
            }

            return res.status(200).json({ events });
        } catch (error) {
            console.error('Error fetching events:', error);
            return res.status(500).json({ error: 'An error occurred while fetching events' });
        }
    }

    static async appendAttendee(req, res) {
        const { id } = req.params;
        const { formData } = req.body;

        if (!formData) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        if (!dbClient.isAlive()) {
            return res.status(500).json({ error: 'Database server not connected' });
        }

        const event = await dbClient.db.collection('events').findOne({ _id: ObjectId.createFromHexString(id) });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const updatedAttendees = [...event.attendees, formData]; // Append new attendee data to the existing array

        await dbClient.db.collection('events').updateOne(
            { _id: ObjectId.createFromHexString(id) },
            { $set: { attendees: updatedAttendees } }
        );

        return res.status(200).json({
            message: 'Attendee added successfully',
            attendees: updatedAttendees
        });
    }
}

module.exports = EventsController;
