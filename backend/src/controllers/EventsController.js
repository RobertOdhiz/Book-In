const dbClient = require('../utils/db');
const { ObjectId } = require('mongodb');

class EventsController {
    static async getEvents(req, res) {
        if (!dbClient.isAlive()) {
            return res.status(500).json({ error: 'Database server not connected' });
        }
        const count = await dbClient.db.collection('events').countDocuments();
        const events = await dbClient.db.collection('events').find({}).toArray();

        return res.status(200).json({ events, count });
    }

    static async getEventById(req, res) {
        const { id } = req.params;

        const event = await dbClient.db.collection('events').findOne({ _id: ObjectId.createFromHexString(id) });

        return res.status(200).json({ event });
    }

    static async postCreateEvent(req, res) {
        const { email, name, date, description, location } = req.body;

        if (!req.body) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        if (!dbClient.isAlive()) {
            return res.status(500).json({ error: 'Database server not connected' });
        }

        const checkUser = await dbClient.db.collection('events').findOne({ name });
        if (checkUser) {
            return res.status(409).json({ error: 'Event already exists' });
        }
        const event = {
            email,
            name,
            date,
            description,
            location
        };

        const result = await dbClient.db.collection('events').insertOne(event);

        return res.status(201).json({ email, name, date, description, location, id: result.insertedId });
    }

    static async updateEventById(req, res) {
        const { id } = req.params;
        const { email, name, date, description, location } = req.body;

        if (!req.body) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        if (!dbClient.isAlive()) {
            return res.status(500).json({ error: 'Database server not connected' });
        }

        const event = await dbClient.db.collection('events').findOne({ _id: ObjectId.createFromHexString(id) });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const result = await dbClient.db.collection('events').updateOne(
            { _id: ObjectId.createFromHexString(id) },
            { $set: { name, date, description, location } }
        );

        return res.status(200).json({ name, date, description, location, id });
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

        const result = await dbClient.db.collection('events').deleteOne({ _id: ObjectId.createFromHexString(id) });

        return res.status(200).json({ message: 'Event deleted' });
    }
}

module.exports = EventsController;
