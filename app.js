const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =process.env.MONGO_URI;
const {ObjectId} = require('mongodb');
//const MONGO_URI = "mongodb+srv://<db_username>:<db_password>@cluster0.2j74r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'))

//begin all my middle wares

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
//run().catch(console.dir);


async function getData(){

  await client.connect();
  let collection = await client.db("vi-database").collection("vi-collection");

  let results = await collection.find({}).toArray();
  //  .limit(50)
  //  .toArray();
  console.log(results)
  // res.send(results).status(200);
  return results;
}

getData();

app.get('/read', async function (req, res) {
  let getDataResults = await getData();
  console.log(getDataResults);

  res.render('zaun',
  {zaunPeeps: getDataResults});

})

app.get('/', function (req, res) {
  res.sendFile('index.html')
})

app.get('/saveMyName', (req,res)=>{
  console.log('GET the end');
  console.log(req.query);

  let reqName = req.query.myName;

  res.render('words',
  {pageTitle: reqName}
 );
})

  //res.redirect('/ejs');
  app.post('/insert', async (req,res)=> {


    console.log('in /insert');
    
    // let newSong = req.body.newSong; //only for POST, GET is req.params? 

    let newGuy = req.body.zaun;
  
    //connect to db,
    await client.connect();
    //point to the collection 
    await client.db("vi-database").collection("vi-collection").insertOne({ zaun: newGuy});
    res.redirect('/read');
  
  }); 

app.post('/saveMyName', (req,res)=>{
  console.log('POST the end');
  console.log(req.body);

 // res.redirect('/ejs');
 res.render('words',
  {pageTitle: req.body.myName}
 );
})

app.get('/nodemon', function (req, res) {
  res.send('look ma, something LOlLLO')
})

app.get('/ejs', function (req, res) {
  res.render('words', 
    {pageTitle: req.body.myName}
  );
})

//endpoint, middleware(s)
app.get('/helloRender', function (req, res) {
  res.send('Hello Express from Real World<br><a href="/">back to home</a>')
})

app.post('/delete/:id', async (req,res)=>{

  console.log("in delete, req.parms.id: ", req.params.id)

  client.connect; 
  const collection = client.db("vi-database").collection("vi-collection");
  let result = await collection.findOneAndDelete( 
    {
      "_id": new ObjectId(req.params.id)
    }
  ).then(result => {
  console.log(result); 
  res.redirect('/read');})

  

})
app.post('/update', async (req,res)=>{

  console.log("req.body: ", req.body)

  client.connect; 
  const collection = client.db("vi-database").collection("vi-collection");
  let result = await collection.findOneAndUpdate( 
  {"_id": new ObjectId(req.body.nameID)}, 
  { $set: {"fname": req.body.inputUpdateName } }
)
.then(result => {
  console.log(result); 
  res.redirect('/read');
})
});


app.listen(port, ()=> console.log(`server is running on .. ${port}`));