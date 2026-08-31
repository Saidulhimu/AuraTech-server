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

const dbconnect = async () => {
  try {
    await client.connect(); 
  
    await client.db("admin").command({ ping: 1 });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log('MongoDB connection error:', error.name, error.message);
  }
};

dbconnect();

/* API Routes */
app.get('/', (req, res) => {
  res.send('Server is running');
});

/* JWT Authentication Endpoint */
app.post('/authentication', async (req, res) => {
  try {
    const user = req.body; 
    if (!user || !user.email) {
      return res.status(400).send({ message: 'Email is required' });
    }
    
    // JWT Token Generation
    const token = jwt.sign(user, process.env.ACCESS_KEY_TOKEN, { expiresIn: '10d' });
    res.send({ token });
  } catch (error) {
    res.status(500).send({ message: 'Token generation failed', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});