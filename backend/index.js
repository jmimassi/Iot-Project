const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mqtt = require("mqtt");
const { MongoClient } = require("mongodb");
const { decode } = require("./functions/decodePayload");
app.use(cors());
const server = http.createServer(app);

//connect the socket.io to the frontend
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Connect to the db
var uri = "mongodb://localhost:27017/MyDb";
var clientMongo = new MongoClient(uri);
function postMongo(xcoord, ycoord) {
  try {
    const database = clientMongo.db("Tracker");
    const Tracker = database.collection("Tracker");
    // Query for a movie that has the title 'Back to the Future'
    const tracking = Tracker.insertOne({
      x_coord: xcoord,
      y_coord: ycoord,
    });
    console.log(tracking);
  } finally {
    // Ensures that the client will close when you finish/error
    // clientMongo.close();
  }
}
// Connect to MQTT
const connectUrl = "mqtt://eu1.cloud.thethings.network:1883";
// const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clean: true,
  connectTimeout: 4000,
  username: "bike-fall-detection@ttn",
  password:
    "NNSXS.YQIANTCOW65AG3IHZMBEM3L2R4EGNYR2HARLFDY.NZST3U6QTP2VJS5IXTJGITPLHXDDJMLSHBEXOWZGG4BG2JICWXLA",
  reconnectPeriod: 1000,
});
client.on("connect", () => {
  console.log("pas Connected");
  var topic = "v3/bike-fall-detection@ttn/devices/eui-70b3d57ed0056395/up";
  console.log("Connected");
  client.subscribe(topic); //single topic
  console.log("connected +subscribed");
});

//handle errors
client.on("error", function (error) {
  console.log("Can't connect" + error);
  process.exit(1);
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  let numberofbikes = 0;
  let _numberofbikes = 0;
  let coord = [];
  //handle incoming messages
  client.on("message", function (topic, message, packet) {
    var getDataFromTTN = JSON.parse(message);
    data = getDataFromTTN.uplink_message.decoded_payload;
    console.log("message is " + message);

    coord = decode(data.bytes);
    console.log("voici les coordonnées : ", coord[0], coord[1]);

    var now = new Date();

    var hour = now.getHours();

    var minute = now.getMinutes();

    var second = now.getSeconds();

    let time = `${hour} : ${minute} : ${second}`;

    _numberofbikes = _numberofbikes + 1;

    numberofbikes = Math.ceil(_numberofbikes / 6);
    console.log(numberofbikes);
    console.log("numberofbikes sent" + numberofbikes);
    socket.emit("numberofbikes", numberofbikes, time);
    console.log(coord[0], coord[1]);
    socket.emit("coordonnee", coord[0], coord[1]);
    postMongo(xcoord, ycoord);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});

exports.clientMongo = clientMongo;
