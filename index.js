var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var kafka = require("kafka-node");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.use(express.static(__dirname + "/src"));

const client = new kafka.KafkaClient({ kafkaHost: "localhost:29092" });
try {
  Consumer = kafka.Consumer;
  consumer = new Consumer(client, [{ topic: "test", partion: 0 }], {
    autocommit: false,
  });
} catch (e) {
  console.log(e)
}

consumer.on("message", function (message) {
  console.log(message);
  console.log(message.value.toString());
  io.emit("kafka", message.value.toString());
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });
});
io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
