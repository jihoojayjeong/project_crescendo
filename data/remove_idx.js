const { MongoClient } = require('mongodb');
require('dotenv').config(); 

const uri = 'mongodb://localhost:27017/feedbackCollection';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function removeIndex() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');


    const database = client.db('feedbackCollection');
    const collection = database.collection('users');

    const result = await collection.dropIndex('username_1');
    console.log('Index removed:', result);
  } catch (err) {
    console.error('Error removing index:', err);
  } finally {
    await client.close();
  }
}

removeIndex().catch(console.error);
