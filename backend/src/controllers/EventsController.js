
class EventsController {
    static async getEvents(req, res) {
        const eventsCollection = await dbClient.dbEvents();

        const events = await eventsCollection.find().toArray();

        return res.status(200).json({ events });
    }

    static async getEventById(req, res) {
        const { id } = req.params;

        const eventsCollection = await dbClient.dbEvents();

        const event = await eventsCollection.findOne({ _id: new ObjectId(id) });

        return res.status(200).json({ event });
    }

    static async postCreateEvent(req, res) {
        const { name, date, description, location } = req.body;

        if (!req.body) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        if (!dbClient.isAlive()) {
            return res.status(500).json({ error: 'Database server not connected' });
        }


        const event = {
            name,
            date,
            description,
            location
        };

        const result = await dbClient.dbEvents().insertOne(event);

        return res.status(201).json({ name, date, description, location, id: result.insertedId });
    }

    static async updateEventById(req, res) {
        const { id } = req.params;
        const { name, date, description, location } = req.body;

        if (!req.body) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        if (!dbClient.isAlive()) {
            return res.status(500).json({ error: 'Database server not connected' });
        }

        const event = await dbClient.dbEvents().findOne({ _id: new ObjectId(id) });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const result = await eventsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { name, date, description, location } }
        );

        return res.status(200).json({ name, date, description, location, id });
    }

    static async deleteEventById(req, res) {
        const { id } = req.params;

        if (!dbClient.isAlive()) {
            return res.status(500).json({ error: 'Database server not connected' });
        }

        const eventsCollection = await dbClient.dbEvents();

        const event = await eventsCollection.findOne({ _id: new ObjectId(id) });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) });

        return res.status(200).json({ message: 'Event deleted' });
    }
}

module.exports = EventsController;
