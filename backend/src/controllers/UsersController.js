const dbClient = require('../utils/db');
const { ObjectId } = require('mongodb');

class UsersController {
    static async postUserRegister(req, res) {
        const { email, userName, userId, organization } = req.body;

        if (!req.body) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        if (!dbClient.isAlive()) {
            return res.status(500).json({ error: 'Database server not connected' });
        }

        const checkUser = await dbClient.db.collection('users').findOne({ email });

        if (checkUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const user = {
            email,
            name: userName,
            userId,
            organization
        };

        const result = await dbClient.db.collection('users').insertOne(user);

        return res.status(201).json({ email, userName, id: result.insertedId });
    }


    static async getUser(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await dbClient.db.collection('users').findOne({ _id: ObjectId.createFromHexString(id) });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ user });
    }

    static async getUsers(req, res) {
        if (dbClient.isAlive() === false) {
            return res.status(500).json({ error: 'Database server not connected' });
        }
        const users = await dbClient.db.collection('users').find({}).toArray();
        return res.status(200).json({ users });
    }

    static async deleteUser(req, res) {
        const { id } = req.params;

        if (!dbClient.isAlive()) {
            return res.status(500).json({ error: 'Database server not connected' });
        }
        const user = await dbClient.db.collection('users').findOne({ _id: ObjectId.createFromHexString(id) });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await dbClient.db.collection('users').deleteOne({ _id: ObjectId.createFromHexString(id) });
        return res.status(200).json({ message: 'User deleted' });
    }
}
module.exports = UsersController;

