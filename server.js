let express = require("express");
let app = express();
let dbConnect = require("./dbConnect");

//dbConnect.dbConnect()
//var app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
//const MongoClient = require('mongodb').MongoClient;

// routes
let projectsRoute = require('./routes/projects')



var port = process.env.PORT || 8080;
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/api/projects',projectsRoute)


const dummyProject={
  author:'alessio',
  imageUrl:'https://getwallpapers.com/wallpaper/full/f/3/a/807159-download-funny-cats-wallpapers-1920x1200-meizu.jpg',
  videoUrl:'https://youtu.be/SkgTxQm9DWM',
  uniqueID:'4',
  description:'We want to create an environemntal and dogs free farm for cats',
  title:'CatsFarm'
}
let dummyData=[dummyProject,dummyProject]



app.get("/test", function (request, response) {
  var user_name = request.query.user_name;
  response.end("Hello " + user_name + "!");
});


//socket test
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  setInterval(()=>{
    socket.emit('number', parseInt(Math.random()*10));
  }, 1000);

});


http.listen(port,()=>{
  console.log("Listening on port ", port);
});



/// DATABASE Connections
//database connection 
//const uri = "mongodb+srv://alexcloud:alexcloud@nsw-bot.nkfb6.mongodb.net/deakincrowds?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

let projectsCollection;

// this function is used to open the connection 
/*const openConnection = (message) => {
  client.connect((err,db) => {
  
    projectsCollection = client.db("deakinCrowds").collection("projects");
    
    if(!err){
      console.log('Database Connected')
    }else{
      console.log('[error]',err)
    }
  });
}*/


// insert project into the db
// takes a project entry, add date to it and pushes into the collection
const insertProject=(project,res)=>{
  // insert into collection
  projectsCollection.insertOne(project,(err,result)=>{
    console.log('Project Inserted',result)
    res.send({result:200})
  }) 
}

// retrieve all projects
const getProjects=(res)=>{
  projectsCollection.find().toArray(function(err, result) {
    if (err) throw err;
    res.send(result)
  })
}

