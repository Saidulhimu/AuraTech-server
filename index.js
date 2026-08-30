const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb'); // <-- 1. Import mongodb
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

/* middleware */
app.use(cors());
app.use(express.json());

/* mongoDB */
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dcdhdqy.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const dbconnect = async () => {
    try {
        await client.connect(); // <-- 2. Add 'await'
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log(error.name, error.message);
    }
}

dbconnect();

/* API Routes */
app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});