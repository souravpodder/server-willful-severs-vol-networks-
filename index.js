const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ctta.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
/* 
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
 */

async function run() {
  try {
    await client.connect();
    console.log('connected to volunteer DB');
    const worksCollection = client.db("volunteerDB").collection("works");
    const registersCollection = client.db("volunteerDB").collection("registers");

    // get all the works 
    app.get('/works', async (req, res) => {
      const q = req.query;
      const cursor = worksCollection.find(q);
      const result = await cursor.toArray();
      res.send(result);
    })

    //get a single work
    app.get('/work/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const work = await worksCollection.findOne(query);
      res.send(work);
    })

    app.post('/work', async (req, res) => {
      const newWork = req.body;
      console.log(newWork)
      const result = await worksCollection.insertOne(newWork);
      res.send(result);
    })

    // handle the registered works 
    app.post('/registration', async (req, res) => {
      const registeredWork = req.body;
      console.log(registeredWork);
      const result = await registersCollection.insertOne(registeredWork);
      res.send(result);
    })

    app.get('/registration', async (req, res) => {
      const query = req.query;
      console.log(query);
      const cursor = registersCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    // delete a registered work 
    app.delete('/registration/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await registersCollection.deleteOne(query);
      res.send(result);
    })
  }
  finally {

  }

}

run();

app.get('/', (req, res) => {
  res.send('server is running of volunteers')
})

app.listen(port, () => {
  console.log('lostening to port', port);
})