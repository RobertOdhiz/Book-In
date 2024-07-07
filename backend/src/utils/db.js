require('dotenv').config();
const { MongoClient } = require('mongodb');

class DBClient {
    constructor() {
        const { DB_HOST, DB_PORT, DB_DATABASE, DB_ATLAS } = process.env;
        console.log(DB_HOST);
        //const url = `mongodb://${DB_HOST}:${DB_PORT}`;
        const uri = DB_ATLAS;
        const url = uri;
        this.client = new MongoClient(url);

        this.client.connect()
            .then(() => {
                this.db = this.client.db(DB_DATABASE)
                console.log('Connection to MongoDB established');
            })
            .catch(console.log('Error connecting to MongoDB:'));
    }
    isAlive() {
        return this.client && this.client.topology && this.client.topology.isConnected();
    }

    async dbUsers() {
        return this.db.collection('users');
    }

    async dbEvents() {
        return this.db.collection('events');
    }
}

const dbClient = new DBClient();
module.exports = dbClient;
