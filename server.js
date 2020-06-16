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
// var protobuf = require("protobufjs");
var aggregateEvent = require("./src/protos/models/events/Aggregate_pb")
// import { fileURLToPath } from "url";
// import { dirname} from "path";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.use(express.static(__dirname + "/src"));
Subscriber.ini(io, kafka, aggregateEvent);




/*io.on("connection", (socket) => {
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
});*/

http.listen(3000, () => {
  console.log("listening on *:3000");
});
