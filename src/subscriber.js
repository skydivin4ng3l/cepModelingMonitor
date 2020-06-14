// import kafka from "kafka-node";
// import socket from "socket.io"
// import protobuf from "protobufjs"
const Subscriber = new Object();
Subscriber.ini = function (io, kafka, protobuf) {



    // const io = socket(server);
    const client = new kafka.KafkaClient({ kafkaHost: "localhost:29092" });
    const admin = new kafka.Admin(client);
    var topics = [{
        topic: 'MONITOR_liveTrainDataStream',
        partitions: 1,
        replicationFactor: 1
    }];
    admin.createTopics(topics, (err, res) => {
        // result is an array of any errors if a given topic could not be created
        console.log('creatingTopics',res)
    });
    admin.listTopics((err, res) => {
        console.log('topics', res);
    });
    try {
        Consumer = kafka.Consumer;
        consumer = new Consumer(client, [{ topic: "MONITOR_liveTrainDataStream", partition: 0, offset: 0 }], {
            autocommit: false,
            encoding: 'buffer',
            // keyEncoding: 'utf8',
            fromOffset: true,
        });
    } catch (e) {
        console.log(e)
    }



    consumer.on("message", function (message) {
        console.log(message);
        var buf = new Buffer(message.value, 'binary');
        //protobuf
        protobuf.load(__dirname +"/events/Event.proto", function(err, root) {
            if (err)
                throw err;

            var Event = root.lookupType("models.events.Event")
            var decodedMessage = Event.decode(buf);
            var object = Event.toObject(decodedMessage, {
                enums: String,  // enums as string names
                longs: String,  // longs as strings (requires long.js)
                bytes: String,  // bytes as base64 encoded strings
                defaults: true, // includes default values
                arrays: true,   // populates empty arrays (repeated fields) even if defaults=false
                objects: true,  // populates empty objects (map fields) even if defaults=false
                oneofs: true    // includes virtual oneof fields set to the present field's name
            });
            console.log(object.liveTrain.stationId);
            console.log(decodedMessage);
            console.log(message.value.toString());
            io.emit("kafka", message.value.toString());
        })

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
}
module.exports = Subscriber;