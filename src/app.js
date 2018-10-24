// const express = require("express");
const express = require("express")

const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const anggotaRoutes = require("./routes/anggota");
const gerejaRoutes = require("./routes/gereja");
 
const kegiatanRoutes = require("./routes/kegiatan");
const tipeKegiatanRoutes = require("./routes/tipekegiatan");
const tipeKegiatanStaticRoutes = require("./routes/tipekegiatanstatic");
const userRoutes = require('./routes/user');
const kelompokRoutes = require('./routes/kelompok');
const keluargaRoutes = require('./routes/keluarga');
 

var Globals = require('./globals')




const app = express();
/* // connect to mongodbatlas on cloud server
mongoose.connect( 
  "mongodb://node-shop:" +
    process.env.MONGO_ATLAS_PW +
    "@node-rest-shop-shard-00-00-wovcj.mongodb.net:27017,node-rest-shop-shard-00-01-wovcj.mongodb.net:27017,node-rest-shop-shard-00-02-wovcj.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin",
  {
    useMongoClient: true
  }
); */
// mongo options :
const options = {
  useNewUrlParser: true,
  // autoIndex: false, // Don't build indexes
  // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  // reconnectInterval: 500, // Reconnect every 500ms
  // poolSize: 10, // Maintain up to 10 socket connections
  // // If not connected, return errors immediately rather than waiting for reconnect
  // bufferMaxEntries: 0,
  // connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  // socketTimeoutMS: 45000, 
  // family: 4 // Use IPv4, skip trying IPv6
};
// var db = mongoose.createConnection('mongodb://localhost/gereja');
// db.useNewUrlParser=true

mongoose.connect('mongodb://localhost/gereja', {
  useNewUrlParser: true
});
 
var dbName="mahk_ranotana"
// global.db = (global.db ? global.db : mongoose.createConnection(app.settings.dburi));
global.dbconnection = mongoose.connection; 


dbconnection.on('error', console.error.bind(console, 'connection error:'));
dbconnection.once('open', function() {
  // we're connected!
  // var dbconnection2=dbconnection.useDb(dbName)
  // console.log("Connected to mongoDB..."+   dbconnection2.db.databaseName + ', url: ' +Globals.serverURL)
  console.log("Connected to mongoDB..."+ dbconnection.db.databaseName+ ', url: ' +Globals.serverURL)
  
});

// global.db = mongoose.connection;

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true); // get rid of deprecated warning of ensureIndex
app.use(morgan("dev"));
// express.static will enable for image download via url 
app.use('/uploads/fotoprofil', express.static('uploads/fotoprofil'));
app.use('/uploads/fotoprofilkeluarga', express.static('uploads/fotoprofilkeluarga'));
// bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


 

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/anggota", anggotaRoutes);
app.use("/kegiatan", kegiatanRoutes);
app.use("/tipekegiatan", tipeKegiatanRoutes);
app.use("/tipekegiatanstatic", tipeKegiatanStaticRoutes);
app.use("/user", userRoutes);
app.use("/kelompok", kelompokRoutes);
app.use("/keluarga", keluargaRoutes);
app.use("/gereja",  gerejaRoutes);

// if the above routes are not executed then it's mostly because the api route is not found
// then the next MIDDLEWARE will be executed

app.use((req, res, next) => {
  const error = new Error("Api not found...");
  error.status = 404;
  next(error); // execute next Middleware when there is an error
});

// Error Middleware which handles error return to client
// this middleware will send all error message in response body in JSON format

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    status : 'error ' + error.status,
    error: {
      message: error.message
    }
  });
});

module.exports = app;
