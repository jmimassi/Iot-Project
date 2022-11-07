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

// let data = ""
function randRange(data) {
    var newData = data[Math.floor(data.length * Math.random())];
    return newData;
}

// You can make functions aswell 
function randomNum(min, max) {
  return parseFloat((Math.random() * (max - min)) + min).toFixed(4); // You can remove the Math.floor if you don't want it to be an integer
}




io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);



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
  console.log("topic is " +  topic);
  var now = new Date();
  
  var hour = now.getHours();

  var minute = now.getMinutes();

  var second = now.getSeconds();

let time = `${hour} : ${minute} : ${second}`;
  socket.emit("numberofbikes", data, time);
  });



// let counter = 0

// let numberofbikes = 0

// function sendnumberofbikes(){
//   socket.emit("numberofbikes", numberofbikes, timer._idleStart)
//   console.log("numberofbikes sent" + numberofbikes)
//   numberofbikes = 0
// }

// setInterval(sendnumberofbikes, 10000)




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




});


server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});