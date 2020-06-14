// import {Subscriber} from "./src/subscriber.mjs";
const Subscriber = require("./src/subscriber.js")
var express = require("express");
// import express from "express"
var app = express();
// import http from "http";
// const server = http.createServer(app);
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var kafka = require("kafka-node");

// import { fileURLToPath } from "url";
// import { dirname} from "path";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.use(express.static(__dirname + "/src"));
Subscriber.ini(io, kafka);
// const client = new kafka.KafkaClient({ kafkaHost: "localhost:29092" });
// const admin = new kafka.Admin(client);
// var topics = [{
//   topic: 'MONITOR_liveTrainDataStream',
//   partitions: 1,
//   replicationFactor: 1
// }];
// admin.createTopics(topics, (err, res) => {
//   // result is an array of any errors if a given topic could not be created
//   console.log('creatingTopics',res)
// });
// admin.listTopics((err, res) => {
//   console.log('topics', res);
// });
// // const client = new kafka.KafkaClient({ kafkaHost: "localhost:29092" });
// try {
//   Consumer = kafka.Consumer;
//   consumer = new Consumer(client, [{ topic: "MONITOR_liveTrainDataStream", partition: 0 }], {
//     autocommit: false,
//   });
// } catch (e) {
//   console.log(e)
// }



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
