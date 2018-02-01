/*
  TODO Passar o Server (app.js) para ES6
*/

var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var port = process.env.PORT || 4040;

app.use(express.static("/node_modules"));
app.use(express.static("public"));

app.get("/", function(req, res, next) {
  res.sendFile(__dirname + "/index.html");
});

server.listen(port, function () {
  console.log("Chat Server listening at port %d", port);
});

var clientCount = 0;

var global = io.of("/global");

global.on("connection", function(client) {

  client.on("join", (name) => {

  });

  client.on("send", function(message) {
    client.broadcast.emit("chat",
      {
        username: client.username,
        message: message
      }
    );
  });

  // this is called when a user join.
  client.on("add user", (username) => {
    // update server clientCount
    clientCount ++;

    client.username = username;
    client.broadcast.emit("user joined",
      {
        id: client.id,
        username: client.username,
        clientCount: clientCount
      }
    );
  });

  client.on("disconnect", () => {
    // update server clientCount
    if (clientCount > 0) clientCount --;

    // broadcast globally (all clients except this) that this client has left
    client.broadcast.emit("user left",
      {
        id: client.id,
        username: client.username,
        clientCount: clientCount
      }
    );
  });

  // when the client emits "start typing", we broadcast it to others
  client.on("start typing", function () {
    client.broadcast.emit("start typing",
      {
        id: client.id,
        username: client.username
      }
    );
  });

  // when the client emits "stop typing", we broadcast it to others
  client.on("stop typing", function () {
    client.broadcast.emit("stop typing",
      {
        id: client.id,
        username: client.username
      }
    );
  });

});
