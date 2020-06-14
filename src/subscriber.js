// import kafka from "kafka-node";
// import socket from "socket.io"
const Subscriber = new Object();
Subscriber.ini = function (io, kafka) {
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
        consumer = new Consumer(client, [{ topic: "MONITOR_AGGREGATED_liveTrainDataStream", partition: 0 }], {
            autocommit: false,
            encoding: 'buffer',
            // keyEncoding: 'utf8',
        });
    } catch (e) {
        console.log(e)
    }



    consumer.on("message", function (message) {
        console.log(message);
        var buf = new Buffer(message.value, 'binary');
        var decodedMessage = long.fromBuffer(buf.slice(0));
        console.log(decodedMessage);
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
}
module.exports = Subscriber;