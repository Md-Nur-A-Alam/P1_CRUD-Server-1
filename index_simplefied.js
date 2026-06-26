require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-xdtfxsh-shard-00-00.0zmykqn.mongodb.net:27017,ac-xdtfxsh-shard-00-01.0zmykqn.mongodb.net:27017,ac-xdtfxsh-shard-00-02.0zmykqn.mongodb.net:27017/?ssl=true&replicaSet=atlas-esirnl-shard-0&authSource=admin&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    await client.connect();

    const usersCollection = client.db('simpleCrud').collection('users');

    // Get all users
    app.get('/users', async (req, res) => {
        const result = await usersCollection.find().toArray();
        res.send(result);
    });

    // Get single user
    app.get('/users/:id', async (req, res) => {
        const id = req.params.id;
        const result = await usersCollection.findOne({
            _id: new ObjectId(id),
        });
        res.send(result);
    });

    // Add new user
    app.post('/users', async (req, res) => {
        const newUser = req.body;
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
    });

    // Delete user
    app.delete('/users/:id', async (req, res) => {
        const id = req.params.id;
        const result = await usersCollection.deleteOne({
            _id: new ObjectId(id),
        });
        res.send(result);
    });

    // Update user
    app.patch('/users/:id', async (req, res) => {
        const id = req.params.id;
        const result = await usersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );
        res.send(result);
    });
}

run();

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});