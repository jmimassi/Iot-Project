const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");


app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let data = ""
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

let counter = 0

let numberofbikes = 0

function sendnumberofbikes(){
  socket.emit("numberofbikes", numberofbikes, timer._idleStart)
  console.log("numberofbikes sent" + numberofbikes)
  numberofbikes = 0
}

setInterval(sendnumberofbikes, 10000)




function toggleSomething() {
    var dataArray = new Array(3000,5000);

    // do stuff, happens to use jQuery here (nothing else does)
    // $("#box").toggleClass("visible");
    console.log(timer)

    clearInterval(timer);
    timer = setInterval(toggleSomething, randRange(dataArray));
    valeuraleatoire = randRange(dataArray)
    console.log(valeuraleatoire)
    console.log("data emitted")
    
    coord1 = randomNum(50.8412085780352, 50.858989454768782)
     
    coord2 = randomNum(4.44082,4.46506)
    console.log(coord1, coord2)
    socket.emit("coordonnee", coord1,coord2)
    numberofbikes = numberofbikes + 1
    console.log(counter)
}
var timer = setInterval(toggleSomething, 1000);




});


server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});