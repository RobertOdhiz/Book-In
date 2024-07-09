const dbClient = require('../utils/db');
const { ObjectId } = require('mongodb');

class UsersController {
    static async postUserRegister(req, res) {
        try {
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
        } catch (err) {
            console.error('Error in postUserRegister:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async getUsers(req, res) {
        try {
            if (!dbClient.isAlive()) {
                return res.status(500).json({ error: 'Database server not connected' });
            }

            // Pagination parameters
            const page = parseInt(req.query.page) || 1; // Default page 1
            const limit = parseInt(req.query.limit) || 10; // Default limit 10

            const skip = (page - 1) * limit;

            const users = await dbClient.db.collection('users')
                .find({})
                .skip(skip)
                .limit(limit)
                .toArray();

            return res.status(200).json({ users });
        } catch (err) {
            console.error('Error in getUsers:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async getUser(req, res) {
        try {
            const { id } = req.params;
            const userId = id;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const user = await dbClient.db.collection('users').findOne({ userId });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json({ user });
        } catch (err) {
            console.error('Error in getUser:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async deleteUser(req, res) {
        try {
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
        } catch (err) {
            console.error('Error in deleteUser:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async deleteUsersByUserId(req, res) {
        try {
            const { userId } = req.params;

            if (!dbClient.isAlive()) {
                return res.status(500).json({ error: 'Database server not connected' });
            }

            const users = await dbClient.db.collection('users').find({ userId }).toArray();
            if (users.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            await dbClient.db.collection('users').deleteMany({ userId });

            return res.status(200).json({ message: `Deleted ${users.length} user(s) with userId: ${userId}` });
        } catch (err) {
            console.error('Error in deleteUsersByUserId:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = UsersController;
