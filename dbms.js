
// db.js
const { MongoClient } = require('mongodb');

  //  const uri = 'mongodb://localhost:27017/?directConnection=true';
 const uri = "mongodb+srv://admin:admin@cluster0.l2lbhpj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

let db;

async function connect() {
  try {
    await client.connect(); 
    db = client.db('Doctor');
    console.log('Connected to MongoDB......./');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

function getDB() {
  return db;
}

module.exports = { connect , getDB };
