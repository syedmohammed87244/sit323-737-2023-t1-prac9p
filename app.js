const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up a connection to MongoDB instance
const uri = 'mongodb://localhost:32000';
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const collection = client.db('mohammed').collection('users');
    const users = [
      { id: 1, name: 'Mohammed' },
      { id: 2, name: 'Shariq' },
      { id: 3, name: 'Jaleel' }
    ];
    await collection.insertMany(users);
    console.log('Users added to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

connectToMongoDB();

app.get('/', (req, res) => {
  res.send('Welcome to our server!!');
});

// Get all users from the MongoDB collection
app.get('/users', async (req, res) => {
  try {
    const collection = client.db('mohammed').collection('users');
    const users = await collection.find().toArray();
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get a user of a specified ID
app.get('/users/:id', async (req, res) => {
  try {
    const collection = client.db('mohammed').collection('users');
    const userId = new ObjectId(req.params.id);
    const user = await collection.findOne({ _id: userId });

    if (user) {
      res.send(user);
    } else {
      res.status(404).send(`User with ID ${req.params.id} not found`);
    }
  } catch (error) {
    console.error('Failed to fetch user', error);
    res.status(500).send('Internal Server Error');
  }
});

// Post a new user to the MongoDB collection
app.post('/users', async (req, res) => {
  try {
    const collection = client.db('mohammed').collection('users');
    const newUser = req.body;
    const result = await collection.insertOne(newUser);
    res.status(200).json(newUser);
  } catch (error) {
    console.error('Failed to add user', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update a user in the MongoDB collection
app.put('/users/:id', async (req, res) => {
  try {
    const collection = client.db('mohammed').collection('users');
    const userId = new ObjectId(req.params.id);
    const updatedUser = req.body;
    const result = await collection.updateOne({ _id: userId }, { $set: updatedUser });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Failed to update user', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a user from the MongoDB collection
app.delete('/users/:id', async (req, res) => {
  try {
    const collection = client.db('mohammed').collection('users');
    const userId = new ObjectId(req.params.id);
    const result = await collection.deleteOne({ _id: userId });
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete user', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
