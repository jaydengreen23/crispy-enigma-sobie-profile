const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =process.env.MONGO_URI;
const {ObjectId} = require('mongodb');
//MONGO_URI = "mongodb+srv://<db_username>:<db_password>@cluster0.2j74r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

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

const db = "vi-database";
const mongoCollection = client.db("jaydenSobieProfile").collection("jaydenSobieCollection");

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
//run().catch(console.dir);


// async function getData(){

//   await client.connect();
//   let collection = await client.db("vi-database").collection("vi-collection");

//   let results = await collection.find({}).toArray();
//   //  .limit(50)
//   //  .toArray();
//   console.log(results)
//   // res.send(results).status(200);
//   return results;
// }

//getData();

app.get('/read', async function (req, res) {
  let getDataResults = await getData();
  console.log(getDataResults);

  res.render('zaun',
  {zaunPeeps: getDataResults});

})

app.get('/', async function (req, res) {
  let results = await mongoCollection.find({}).toArray();

  res.render('profile',{profileData:results});
})

function initProfileData(){
  mongoCollection.insertOne({
    title: "this is blog title",
    post: "this is the post"
  });
}

initProfileData();

  //res.redirect('/ejs');
  app.post('/insert', async (req,res)=> {
    let resuls = await mongoCollection.insertOne({
      title : req.body.title,
      post:req.body.post
    })
    res.redirect('/');
  }); 


  app.post('/delete', async function (req, res) {
  
    let result = await mongoCollection.findOneAndDelete( 
    {
      "_id": new ObjectId(req.body.deleteId)
    }
  ).then(result => {
    
    res.redirect('/');
  })

}); 

app.post('/update', async (req,res)=>{
  let result = await mongoCollection.findOneAndUpdate( 
  {_id: ObjectId.createFromHexString(req.body.updateId)}, { 
    $set: 
      {
        title : req.body.updateTitle, 
        post : req.body.updatePost 
      }
     }
  ).then(result => {
  console.log(result); 
  res.redirect('/');
})
}); 


app.listen(port, ()=> console.log(`server is running on .. ${port}`));