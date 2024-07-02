require('dotenv').config();
const { MongoClient } = require('mongodb');

class DBClient {
    constructor() {
        const host = process.env.DB_HOST;
        const port = process.env.DB_PORT;
        const url = `mongodb://${host}:${port}`;
        const database = process.env.DB_DATABASE;
        this.client = new MongoClient(url, { useUnifiedTopology: true });

        this.client.connect()
            .then(() => {
                console.log('Connected to MongoDB client');
                this.client_db = this.client.db(database);
            })
            .catch((err) => {
                console.error(`Connection to MongoDB failed with Error: ${err}`);
            });
    }

    isAlive() {
        return this.client && this.client.topology && this.client.topology.isConnected();
    }

    async dbUsers() {
        return this.client_db.collection('users');
    }

    async dbEvents() {
        return this.client_db.collection('events');
    }
}

const dbClient = new DBClient();
module.exports = dbClient;
