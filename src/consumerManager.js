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

    /*var topics = [{
        topic: 'MONITOR_AGGREGATED_liveTrainDataStream',
        partitions: 1,
        replicationFactor: 1
    }];
    this.consumer.admin.createTopics(topics, (err, res) => {
        // result is an array of any errors if a given topic could not be created
        console.log('creatingTopics',res)
    });*/
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
    function registerSubscribedTopic(topicSuffix) {
        console.log("registerConsumer for: ", topicSuffix)
        ConsumerManager.registerSubscribedTopic(topicSuffix);
    }
    io.on("connection", (socket) => {
        console.log("a user connected");
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
        socket.on("chat message", (msg) => {
            console.log("message: " + msg);
        });
        socket.on("registerConsumer", (topicSuffix) => { registerSubscribedTopic(topicSuffix)}/*function(topicSuffix) {
            console.log("registerConsumer for: ", topicSuffix)
            this.registerSubscribedTopic(topicSuffix);
        }*/)
        socket.on("deleteConsumer", function(topicSuffix){
            console.log("deleteConsumer for: ", topicSuffix)
            this.removeFromSubscribedTopic(topicSuffix)
        })
    });
    /*io.on("connection", (socket) => {
        socket.on("chat message", (msg) => {
            io.emit("chat message", msg);
        });
    });*/
}
ConsumerManager.initTopic = function(topicSuffix){
    let topics = [{
        topic: 'MONITOR_' + topicSuffix,
        partitions: 1,
        replicationFactor: 1
    },{
        topic: 'MONITOR_AGGREGATED_' + topicSuffix,
        partitions: 1,
        replicationFactor: 1
    }];
    this.consumer.admin.createTopics(topics, (err, res) => {
        // result is an array of any errors if a given topic could not be created
        console.log('addedTopics: ',res)
    });
}
ConsumerManager.removeTopic = function(topicSuffix) {
    this.consumer.admin.removeTopics(['MONITOR_' + topicSuffix,'MONITOR_AGGREGATED_' + topicSuffix], (err, removed) => {
        // result is an array of any errors if a given topic could not be created
        console.log('removedTopics: ',removed)
    })
}
ConsumerManager.initConsumers = function() {
    //initialize with the first topic
    this.initAggregateConsumer();
    this.initMonitorConsumer();

}
ConsumerManager.addConsumer = function(topicSuffix) {
    this.initTopic(topicSuffix);
    this.consumer.monitor.addTopics([{topic: 'MONITOR_' + topicSuffix }], function (err, added) {
        if(err) {
            console.warn(err);
        }
        console.log(added);
    });
    this.consumer.aggregate.addTopics([{topic: 'MONITOR_AGGREGATED_' + topicSuffix }], function (err, added) {
        if(err) {
            console.warn(err);
        }
        console.log(added)
    });
}

ConsumerManager.initMonitorConsumer = function() {
    let fetchRequests = new Array()
    for(let topic of this.subscribedTopics.keys()) {
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
        io.emit("kafkaMonitor", kafkaMessage);

    });
}
ConsumerManager.initAggregateConsumer = function() {
    let fetchRequests = new Array()
    for(let topic of this.subscribedTopics.keys()) {
        fetchRequests.push({
            topic: "MONITOR_AGGREGATED_" + topic,
            partition: 0,
        })
    }
    try {
        // Consumer = kafka.Consumer;
        this.consumer.aggregate = new kafka.Consumer(
            this.clients.aggregate,
            fetchRequests,
            {
            autocommit: false,
            // autoCommitIntervalMs: 5000,
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
            value: decodedMessage.getVolume()
        })
        io.emit("kafkaAggregated", kafkaMessage/*decodedMessage.getVolume()*/);

    });
    this.consumer.aggregate.on('error', function (err)
    {
        console.log('ERROR: ' + err.toString());
    });
}
ConsumerManager.registerSubscribedTopic = function(topicSuffix) {
    // let currentSubscriberCount = this.subscribedTopics.get(message)
    console.log(this.subscribedTopics.size)
    if(this.subscribedTopics.size === 0) {
        // this.updateSubscribedTopics(topicSuffix, false)
        this.subscribedTopics.set(topicSuffix,1)
        this.initConsumers();
    } else {
        this.updateSubscribedTopics(topicSuffix, false)
    }
}
ConsumerManager.removeFromSubscribedTopic = function(topicSuffix) {
    this.updateSubscribedTopics(topicSuffix, true)
    if(this.subscribedTopics.get(topicSuffix) === 0) {
        this.removeTopic(topicSuffix)
    }
}
ConsumerManager.updateSubscribedTopics = function(topicSuffix, remove) {
    console.log("updateConsumers: " + topicSuffix, "removed: " +remove);
    let currentSubscriberCount = this.subscribedTopics.get(topicSuffix)
    if(remove) {
        if(currentSubscriberCount === 1) {
            this.subscribedTopics.delete(topicSuffix)
            // this.removeTopic(topicSuffix);
        } else if(currentSubscriberCount > 1) {
            this.subscribedTopics.set( topicSuffix, currentSubscriberCount - 1 );
        }
    } else {
        if(currentSubscriberCount == null) {
            currentSubscriberCount = 0;
            this.addConsumer(topicSuffix)
        }
        this.subscribedTopics.set( topicSuffix, currentSubscriberCount + 1);
    }
}
module.exports = ConsumerManager;