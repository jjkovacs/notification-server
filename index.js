var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var VehicleSubscriber = require('./src/Vehicle-Subscriber');
var AlertPublisher = require('./src/Alert-Publisher');

var app = express()
var port = process.env.PORT || 5000

// app.use(express.static(__dirname + "/"))

// var server = http.createServer(app)
// server.listen(port)

console.log("http server listening on %d", port)

//var wss = new WebSocketServer({ server: server })
var wss = new WebSocketServer({ port: port });
console.log("websocket server created")

var subscriberCache = {};
var subscriberId = 0;

var publisherCache = {};
var publisherId = 0;

// app.get('/', function(req, res){
//   console.log('>>>>> GET REQUEST');
  
//   res.json({
//     'msg': 'Whoop, there it is.'
//   });
// });

// app.get('*', function(req, res) {
//   console.log('>>>>> UNKNOWN REQUEST', req);
  
//   res.json({
//     msg: 'What is this trash youre sending me??'
//   });
// });

wss.on("connection", function(ws) {
  
  console.log('>>>>> NEW CONNECTION');
  
  ws.on('message', handleMessage);
  
  function handleMessage(m) {
    var message = JSON.parse(m);
    
    switch(message.type) {
      case 'subscriber': 
        ws.removeListener('message', handleMessage);
        
        var id = ++subscriberId;
        var subscriber = new VehicleSubscriber(ws, message.vin);
        
        subscriber.onClose(function(){
          delete subscriberCache[id];
        });
        
        subscriberCache[id] = subscriber;
        break;
      case 'publisher':
        ws.removeListener('message', handleMessage);
        
        var publisher = new AlertPublisher(ws, subscriberCache);
        
        publisher.onClose(function(){
          delete publisherCache[id];
        });
        
        publisherCache[id] = publisher;
        break;
      default:
        console.log('Unhandled Message: ', m);
        break;
    }
  }
})
