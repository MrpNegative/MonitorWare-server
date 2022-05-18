const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const jwt = require("jsonwebtoken");
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

    // Auth
    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.DB_ACCESS_TOKEN, {
        expiresIn: "5d",
      });
      res.send({ accessToken });
    });

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
    // app.get("/inventory/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const service = await warhorseCollection.findOne(query);
    //   res.send(service);
    // });
    // delete by id
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await warhorseCollection.deleteOne(query);
      res.send(result);
    });
    // filter by email
    app.get("/inventory/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const cursor = warhorseCollection.find({ email: email });
      const result = await cursor.toArray();
      res.send(result);
    });
    // petch data
    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updateItem = req.body;
      console.log(updateItem);
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateItem.dq,
        },
      };
      const result = await warhorseCollection.updateOne(
        query,
        updateDoc,
        option
      );
      res.send(result);
    });
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

// app.get("/inventory", async (req, res) => {
//   const email = req.query;
//   console.log(email);
//   const cursor = warhorseCollection.find({email: email});
//   const result = await cursor.toArray();
//   res.send(result);
// });
