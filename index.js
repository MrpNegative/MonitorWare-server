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

const jwtVerify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ massage: "unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.DB_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).send({ massage: "Access Forbidden" });
    }
    req.decoded = decoded;
    next();
  });
};

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

    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await warhorseCollection.findOne(query);
      res.send(service);
    });
    // delete by id
    app.delete("/inventory/:id", async (req, res) => {
      const id = req?.params.id;
      const query = { _id: ObjectId(id) };
      const result = await warhorseCollection.deleteOne(query);
      res.send(result);
    });
    // filter by email
    app.get("/inventory/:email", jwtVerify, async (req, res) => {
      const dcMail = req?.decoded.email;
      const email = req?.params.email;
      if (email === dcMail) {
        const cursor = warhorseCollection.find({ email: email });
        const result = await cursor.toArray();
        res.send(result);
      } else {
        res.status(403).send({ massage: "Access Forbidden" });
      }
    });
    // peach data
    app.put("/inventory/:id", async (req, res) => {
      const id = req?.params.id;
      const query = { _id: ObjectId(id) };
      const updateItem = req?.body;
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateItem?.dq,
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
