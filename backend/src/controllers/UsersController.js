const dbClient = require('../utils/db');

class UsersController {
    static async postUserRegister(req, res) {
        return res.status(200).json({ data: req.body });

        // const { email, userName, userId, organization } = req.body;

        // if (!req.body) {
        //     return res.status(400).json({ error: 'Invalid input' });
        // }

        // if (!dbClient.isAlive()) {
        //     return res.status(500).json({ error: 'Database server not connected' });
        // }

        // const usersCollection = await dbClient.dbUsers();

        // const checkUser = await usersCollection.findOne({ email });

        // if (checkUser) {
        //     return res.status(400).json({ error: 'User already exists' });
        // }

        // const user = {
        //     email,
        //     name: userName,
        //     userId,
        //     organization
        // };

        // const result = await usersCollection.insertOne(user);

        // return res.status(201).json({ email, userName, id: result.insertedId });
    }

    static async getMe(req, res) {
        return res.status(200).json({ success: 'Test Success' });
    }

    static async postUserLogin(req, res) {
        const { email, userName, userId, organization } = req.body;

        if (!req.body) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        if (!dbClient.isAlive()) {
            return res.status(500).json({ error: 'Database server not connected' });
        }

        const usersCollection = await dbClient.dbUsers();

        const checkUser = await usersCollection.findOne({ email });

        if (checkUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = {
            email,
            name: userName,
            userId,
            organization
        };

        const result = await usersCollection.insertOne(user);

        return res.status(201).json({ email, userName, id: result.insertedId });

        //return res.status(200).json({ data: req.body });
    }
}

module.exports = UsersController;
