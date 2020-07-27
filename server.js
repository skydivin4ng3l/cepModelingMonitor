// import {Subscriber} from "./src/subscriber.mjs";
var express = require("express");
// import express from "express"
var app = express();
// import http from "http";
// const server = http.createServer(app);
var http = require("http").createServer(app);
// var io = require("socket.io")(http);
// var kafka = require("kafka-node");
// const Subscriber = require("./src/monitorSubscriber.js")
const ConsumerManager = require("./src/consumerManager.js")
// var protobuf = require("protobufjs");
//var aggregateEvent = require("./src/protos/models/events/Aggregate_pb")
// import { fileURLToPath } from "url";
// import { dirname} from "path";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
var Chart = require('chart.js');
// var joint = require('jointjs');

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.use(express.static(__dirname + "/src"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
ConsumerManager.ini(http);


http.listen(3000, () => {
  console.log("listening on *:3000");
});
