const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const app = express();

// medal ware
app.use(express.json());
app.use(cors());

// mongo script
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ext34.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    console.log("mongoConnected");
    const warhorseCollection = client.db("warhorse").collection("inventory");

    // inventory
    // get
    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = warhorseCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // post
    app.post("/inventory", async (req, res) => {
      const newItem = req.body;
      const result = await warhorseCollection.insertOne(newItem);
      res.send(result);
    });
    // filter by id
    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await warhorseCollection.findOne(query);
      res.send(service);
    });
    // delete by id 
    app.get('/inventory/:id', async(req, res)=>{
      
    })

  } finally {
    //kk
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send({ massage: "warhouse website running" });
});

app.listen(port, () => {
  console.log("warhouse server is runing on port", port);
});
