const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

/* middleware */
app.use(cors());
app.use(express.json());

/* mongoDB Connection URI */
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dcdhdqy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database & Collections (Global Scope)
const db = client.db("auratech");
const usersCollection = db.collection("users");
const productsCollection = db.collection("products");
const ordersCollection = db.collection("orders");

// Connect to MongoDB Database
async function dbConnect() {
  try {
    await client.connect();
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.name, error.message);
  }
}
dbConnect();

/* ------------------- ROOT ROUTE ------------------- */
app.get('/', (req, res) => {
  res.send('Server is running');
});

/* ------------------- USER API ROUTES ------------------- */

// Post user data into the database
app.post('/users', async (req, res) => {
  try {
    const user = req.body;
    if (!user.email) {
      return res.status(400).send({ message: 'Email is required' });
    }

    const query = { email: user.email };
    const existingUser = await usersCollection.findOne(query);

    if (existingUser) {
      return res.send({ message: 'User already exists', insertedId: null });
    }

    const result = await usersCollection.insertOne(user);
    res.send(result);
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

/* JWT Authentication Endpoint */
app.post('/authentication', async (req, res) => {
  try {
    const user = req.body;
    if (!user || !user.email) {
      return res.status(400).send({ message: 'Email is required' });
    }

    const token = jwt.sign(user, process.env.ACCESS_KEY_TOKEN, { expiresIn: '10d' });
    res.send({ token });
  } catch (error) {
    res.status(500).send({ message: 'Token generation failed', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});