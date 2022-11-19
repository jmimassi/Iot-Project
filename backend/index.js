const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mqtt = require('mqtt')


app.use(cors());

const server = http.createServer(app);




const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// // let data = ""
// function randRange(data) {
//   var newData = data[Math.floor(data.length * Math.random())];
//   return newData;
// }

// // You can make functions aswell 
function randomNum(min, max) {
  return parseFloat((Math.random() * (max - min)) + min).toFixed(4); // You can remove the Math.floor if you don't want it to be an integer
}
let numberofbikes = 0;
let coord= []

function decode(gpsarduino){

  xcoord = gpsarduino.slice(0,4)
  ycoord = gpsarduino.slice(4,8)

  let stringx = [];
  for (var i=0; i<xcoord.slice(0,4).length; i++){
    stringx += xcoord.slice(0,4)[i]

  }

  let stringyy = [];
  for (var i=0; i<ycoord.slice(0,4).length; i++){
    stringyy += ycoord.slice(0,4)[i]
  }

  xfinal = parseInt(stringx) / 1000000
  yfinal = parseInt(stringyy) / 1000000
  console.log("voici le décode : ",xfinal, yfinal)
  return [xfinal, yfinal]
  }



const connectUrl = "mqtt://eu1.cloud.thethings.network:1883"
// const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clean: true,
  connectTimeout: 4000,
  username: 'bike-fall-detection@ttn',
  password: 'NNSXS.YQIANTCOW65AG3IHZMBEM3L2R4EGNYR2HARLFDY.NZST3U6QTP2VJS5IXTJGITPLHXDDJMLSHBEXOWZGG4BG2JICWXLA',
  reconnectPeriod: 1000,
})
client.on('connect', () => {
  console.log('pas Connected')
  var topic = "v3/bike-fall-detection@ttn/devices/eui-70b3d57ed0056395/up";
  console.log('Connected')
  client.subscribe(topic); //single topic
  console.log("connected +subscribed");
});

//handle errors
client.on("error", function (error) {
  console.log("Can't connect" + error);
  process.exit(1)
});
//handle incoming messages
client.on("message", function (topic, message, packet) {
  var getDataFromTTN = JSON.parse(message);
  data = getDataFromTTN.uplink_message.decoded_payload;
  console.log("message is " + message);
  numberofbikes = numberofbikes + 1
  console.log(numberofbikes)
  coord = decode(data.bytes)
  console.log("voici les coordonnées : ",coord[0],coord[1])
});





io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);







  // let counter = 0







  // function toggleSomething() {
  //     var dataArray = new Array(3000,5000);

  //     // do stuff, happens to use jQuery here (nothing else does)
  //     // $("#box").toggleClass("visible");
  //     console.log(timer)

  //     clearInterval(timer);
  //     timer = setInterval(toggleSomething, randRange(dataArray));
  //     valeuraleatoire = randRange(dataArray)
  //     console.log(valeuraleatoire)
  //     console.log("data emitted")

  //     coord1 = randomNum(50.8412085780352, 50.858989454768782)

  //     coord2 = randomNum(4.44082,4.46506)
  //     console.log(coord1, coord2)
  //     socket.emit("coordonnee", coord1,coord2)
  //     numberofbikes = numberofbikes + 1
  //     console.log(counter)
  // }
  // var timer = setInterval(toggleSomething, 1000);
  let a = 0;
  function sendnumberofbikes() {
    var now = new Date();

    var hour = now.getHours();

    var minute = now.getMinutes();

    var second = now.getSeconds();

    let time = `${hour} : ${minute} : ${second}`;

    console.log(numberofbikes)

    console.log("numberofbikes sent" + numberofbikes)

    socket.emit('numberofbikes', numberofbikes, time);
    
    // coord1 = randomNum(50.8412085780352, 50.858989454768782)
    
    // coord2 = randomNum(4.44082, 4.46506)
    console.log(coord[0], coord[1])
    // socket.emit("coordonnee", coord[0], coord[1])
    socket.emit("coordonné", )
    // numberofbikes = numberofbikes - numberofbikes;
  }
  setInterval(sendnumberofbikes, 10000)



});


server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});