// import kafka from "kafka-node";
// import socket from "socket.io"
// import protobuf from "protobufjs"
const Subscriber = new Object();
Subscriber.ini = function (io, kafka, aggregateEvent) {



    // const io = socket(server);
    const client = new kafka.KafkaClient({ kafkaHost: "localhost:29092" });
    const admin = new kafka.Admin(client);
    var topics = [{
        topic: 'MONITOR_AGGREGATED_liveTrainDataStream',
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
        consumer = new Consumer(client, [{ topic: "MONITOR_AGGREGATED_liveTrainDataStream", partition: 0, offset: 0 }], {
            autocommit: false,
            encoding: 'buffer',
            // keyEncoding: 'utf8',
            fromOffset: true,
        });
    } catch (e) {
        console.log(e)
    }



    consumer.on("message", function (message) {
        console.log("message",message);
        var buf = Buffer.from(message.value, 'binary');

        var decodedMessage = aggregateEvent.Aggregate.deserializeBinary(buf);
        console.log("decodedMessage",decodedMessage)
        console.log(message.topic,"value",decodedMessage.getVolume())

        io.emit("kafka", decodedMessage.getVolume());

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