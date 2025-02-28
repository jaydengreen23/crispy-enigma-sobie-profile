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

// function initProfileData(){
//   mongoCollection.insertOne({
//     company: "this is blog title",
//     secret: "this is the post"
//   });
// }



  //res.redirect('/ejs');
  app.post('/insert', async (req,res)=> {
    let resuls = await mongoCollection.insertOne({
      company : req.body.company,
      secret:req.body.secret
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
        company : req.body.updateTitle, 
        secret : req.body.updatePost 
      }
     }
  ).then(result => {
  console.log(result); 
  res.redirect('/');
})
}); 


app.listen(port, ()=> console.log(`server is running on .. ${port}`));