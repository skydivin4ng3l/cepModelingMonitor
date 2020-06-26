// import kafka from "kafka-node";
// import socket from "socket.io"
var kafka = require("kafka-node");
var aggregateEvent = require("./protos/models/events/Aggregate_pb");
var io;
const ConsumerManager = new Object();
ConsumerManager.clients = new Object();
ConsumerManager.consumer = new Object();
ConsumerManager.subscribedTopics = new Map();
ConsumerManager.ini = function (http) {

    io = require("socket.io")(http);

    // const io = socket(server);
    this.clients.admin = new kafka.KafkaClient({ kafkaHost: "localhost:29092" });
    this.clients.monitor = new kafka.KafkaClient({ kafkaHost: "localhost:29092" });
    this.clients.aggregate = new kafka.KafkaClient({ kafkaHost: "localhost:29092" });



    this.consumer.admin = new kafka.Admin(this.clients.admin);

    var topics = [{
        topic: 'MONITOR_AGGREGATED_liveTrainDataStream',
        partitions: 1,
        replicationFactor: 1
    }];
    this.consumer.admin.createTopics(topics, (err, res) => {
        // result is an array of any errors if a given topic could not be created
        console.log('creatingTopics',res)
    });
    this.consumer.admin.listTopics((err, res) => {
        console.log('topics', res);
    });

    // try {
    //     // Consumer = kafka.Consumer;
    //     this.consumer.aggregate = new kafka.Consumer(this.clients.aggregate, [{ topic: "MONITOR_AGGREGATED_liveTrainDataStream", partition: 0/*, offset: 0*/ }], {
    //         autocommit: true,
    //         autoCommitIntervalMs: 5000,
    //         encoding: 'buffer',
    //         // keyEncoding: 'utf8',
    //         fromOffset: 'latest'/*true*/,
    //     });
    // } catch (e) {
    //     console.log(e)
    // }
    //
    // this.consumer.aggregate.on("message", function (message) {
    //     console.log("message",message);
    //     var buf = Buffer.from(message.value, 'binary');
    //     if(message.topic)
    //
    //     var decodedMessage = aggregateEvent.Aggregate.deserializeBinary(buf);
    //     console.log("decodedMessage",decodedMessage)
    //     console.log(message.topic,"value",decodedMessage.getVolume())
    //     let kafkaMessage = new Object({
    //         topic: message.topic,
    //         value: decodedMessage
    //     })
    //     io.emit("kafka", decodedMessage.getVolume());
    //
    // });

    io.on("connection", (socket) => {
        console.log("a user connected");
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
        socket.on("chat message", (msg) => {
            console.log("message: " + msg);
        });
        socket.on("registerConsumer", function(message) {
            this.registerSubscribedTopic(message);
        })
        socket.on("deleteConsumer", function(message){

        })
    });
    /*io.on("connection", (socket) => {
        socket.on("chat message", (msg) => {
            io.emit("chat message", msg);
        });
    });*/
}
ConsumerManager.initConsumers = function() {
    //initialize with the first topic
    this.initAggregateConsumer()
    this.initMonitorConsumer()

}
ConsumerManager.initMonitorConsumer = function() {
    let fetchRequests = new Array()
    for(let topic of this.subscribedTopics) {
        fetchRequests.push({
            topic: "MONITOR_" + topic,
            partition: 0,
        })
    }
    try {
        // Consumer = kafka.Consumer;
        this.consumer.monitor = new kafka.Consumer(this.clients.monitor, fetchRequests/*[{ topic: "MONITOR_AGGREGATED_liveTrainDataStream", partition: 0/!*, offset: 0*!/ }]*/, {
            autocommit: true,
            autoCommitIntervalMs: 5000,
            encoding: 'buffer',
            // keyEncoding: 'utf8',
            fromOffset: 'latest'/*true*/,
        });
    } catch (e) {
        console.log(e)
    }

    this.consumer.monitor.on("message", function (message) {
        console.log("message",message);
        var buf = Buffer.from(message.value, 'binary');

        /*var decodedMessage = aggregateEvent.Aggregate.deserializeBinary(buf);
        console.log("decodedMessage",decodedMessage)
        console.log(message.topic,"value",decodedMessage.getVolume())*/
        let kafkaMessage = new Object({
            topic: message.topic,
            value: message.value
        })
        io.emit("kafka", kafkaMessage);

    });
}
ConsumerManager.initAggregateConsumer = function() {
    let fetchRequests = new Array()
    for(let topic of this.subscribedTopics) {
        fetchRequests.push({
            topic: "MONITOR_AGGREGATED_" + topic,
            partition: 0,
        })
    }
    try {
        // Consumer = kafka.Consumer;
        this.consumer.aggregate = new kafka.Consumer(this.clients.aggregate, fetchRequests/*[{ topic: "MONITOR_AGGREGATED_liveTrainDataStream", partition: 0/!*, offset: 0*!/ }]*/, {
            autocommit: true,
            autoCommitIntervalMs: 5000,
            encoding: 'buffer',
            // keyEncoding: 'utf8',
            fromOffset: 'latest'/*true*/,
        });
    } catch (e) {
        console.log(e)
    }

    this.consumer.aggregate.on("message", function (message) {
        console.log("message",message);
        var buf = Buffer.from(message.value, 'binary');
        if(message.topic)

            var decodedMessage = aggregateEvent.Aggregate.deserializeBinary(buf);
        console.log("decodedMessage",decodedMessage)
        console.log(message.topic,"value",decodedMessage.getVolume())
        let kafkaMessage = new Object({
            topic: message.topic,
            value: decodedMessage
        })
        io.emit("kafka", kafkaMessage/*decodedMessage.getVolume()*/);

    });
}
ConsumerManager.registerSubscribedTopic = function(topicSuffix) {
    // let currentSubscriberCount = this.subscribedTopics.get(message)
    if(this.subscribedTopics.size == 0) {
        this.updateSubscribedTopics(topicSuffix, false)
        this.initConsumers();
    } else {
        this.updateSubscribedTopics(topicSuffix, false)
    }
}
ConsumerManager.removeFromSubscribedTopic = function(topicSuffix) {
    this.updateSubscribedTopics(topicSuffix, true)
    if(this.subscribedTopics.size == 0) {
        //TODO delete KafkaConsumers?
    }
}
ConsumerManager.updateSubscribedTopics = function(topicSuffix, remove) {
    console.log("updateConsumers: " + topicSuffix, "add: " +remove);
    let currentSubscriberCount = this.subscribedTopics.get(topicSuffix)
    if(remove) {
        if(currentSubscriberCount == 1) {
            this.subscribedTopics.delete(topicSuffix)
            //TODO remove topic from KafkaConsumers
        } else if(currentSubscriberCount > 1) {
            this.subscribedTopics.set( topicSuffix, currentSubscriberCount - 1 );
        }
    } else {
        if(currentSubscriberCount == null) {
            currentSubscriberCount = 0;
            //TODO Add topic to KafkaConsumers
        }
        this.subscribedTopics.set( topicSuffix, currentSubscriberCount + 1);
    }
}
module.exports = ConsumerManager;