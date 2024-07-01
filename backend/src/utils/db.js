/** 
 * index.js module with api endpoints routes
*/
import { MongoClient } from 'mongodb';
require('doetenv').config();

class DBClient {
    constructor() {
        const host = process.env(DB_HOST);
        const port = process.env(DB_PORT);
        const url = `mongodb://${host}:${port}`;
        const database = process.env(DB_DATABASE);
        this.client = new MongoClient(url, { useUnifiedTopology: true });
        this.client.connect()
            .then(() => {
                console.log('Connected to MongoDB client');
                this.client_db = client.db(database);
            })
            .catch((err) => {
                console.error(`Connection to MongoDb failed with Error: ${err}`)
            });
    }

    async dbUsers() {
        return await this.client_db.collection('users');
    }

    async dbEvents() {
        return await this.client_db.collection('events');
    }
}

const dbClient = new DBClient();
module.exports = dbClient;