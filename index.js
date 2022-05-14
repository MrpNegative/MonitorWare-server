const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const app = express();

// medal ware
app.use(express.json());
app.use(cors());

// mongo script
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ext34.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
     await client.connect();
     console.log('mongoConnected')
    const collection = client.db("warhorse").collection("inventory");

    // items
    app.get('/inventory', async(req, res)=>{
        res.send('inventory')
    })
  } finally {
    //kk
  }
};
run().catch(console.dir)

app.get("/", (req, res) => {
  res.send({ massage: "warhouse website running" });
});

app.listen(port, () => {
  console.log("warhouse server is runing on port", port);
});
