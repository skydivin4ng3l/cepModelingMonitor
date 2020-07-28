var kafka = require("kafka-node");
var aggregateEvent = require("./protos/models/events/Aggregate_pb");
var io;
const AGGREGATED_PREFIX = "MONITOR_AGGREGATED_";
const MONITOR_PREFIX = "MONITOR_";
const ConsumerManager = new Object();
ConsumerManager.clients = new Object();
ConsumerManager.consumer = new Object();
ConsumerManager.subscribedTopics = new Map();
ConsumerManager.offsetsSubscribedTopics = new Map();
ConsumerManager.ini = function (http) {

    io = require("socket.io")(http);

    // const io = socket(server);
    this.clients.admin = new kafka.KafkaClient({ kafkaHost: "localhost:29092" });
    this.clients.monitor = new kafka.KafkaClient({ kafkaHost: "localhost:29092" });
    this.clients.aggregate = new kafka.KafkaClient({ kafkaHost: "localhost:29092" });
    this.clients.offset = new kafka.KafkaClient({ kafkaHost: "localhost:29092" });

    this.consumer.admin = new kafka.Admin(this.clients.admin);
    this.consumer.offset = new kafka.Offset(this.clients.offset);

    this.consumer.admin.listTopics((err, res) => {
        console.log('topics', res);
    });

    function registerSubscribedTopic(topicSuffix) {
        console.log("registerConsumer for: ", topicSuffix)
        ConsumerManager.registerSubscribedTopic(topicSuffix);
    }
    io.on("connection", (socket) => {
        console.log("a user connected");
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
        socket.on("registerConsumer", (topicSuffix) => { registerSubscribedTopic(topicSuffix)}/*function(topicSuffix) {
            console.log("registerConsumer for: ", topicSuffix)
            this.registerSubscribedTopic(topicSuffix);
        }*/)
        socket.on("deleteConsumer", function(topicSuffix){
            console.log("deleteConsumer for: ", topicSuffix)
            ConsumerManager.removeFromSubscribedTopic(topicSuffix)
        })
        socket.on("resetSubscribedTopics", function () {
            console.log("resetting SubscribedTopics");
            ConsumerManager.resetSubscribedTopics()
        })
        socket.on("startMonitoring", function () {
            console.log("Start Monitoring");
            ConsumerManager.initTopics(
                ConsumerManager.subscribedTopics.keys(), function () {
                    return ConsumerManager.updateOffsets(ConsumerManager.initConsumers)
                }
            )
        })
    });
}
ConsumerManager.resetSubscribedTopics = function(){
    ConsumerManager.subscribedTopics = new Map();
}
/*ConsumerManager.initTopic = function(topicSuffix){
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
}*/
ConsumerManager.initTopics = function(topicSuffixArray, callbackFunction){
    console.log("InitTopics: ",topicSuffixArray);
    let promise = new Promise(function(resolve, reject){
        let topics = [];
        for( let topicSuffix of topicSuffixArray ) {
            topics.push({
                topic: AGGREGATED_PREFIX + topicSuffix,
                partitions: 1,
                replicationFactor: 1
            });
            topics.push({
                topic: MONITOR_PREFIX+ topicSuffix,
                partitions: 1,
                replicationFactor: 1
            });
        }
        console.log("topics to add: ", topics)
        ConsumerManager.consumer.admin.createTopics( topics, function (error, result) {
            if(error) {
                console.warn("createTopics ERROR: ",error)
            }
            console.log("createTopics result: ", result)
            resolve();
        })
    })
    promise.then(
        function(result){callbackFunction()},
        function(error){
            console.warn("TopicCreation Failed")
        }
    )
}
ConsumerManager.removeTopic = function(topicSuffix) {
    //TODO remove KafkaConsumer
    let topicToRemove = [MONITOR_PREFIX + topicSuffix]
    this.consumer.monitor.removeTopics(topicToRemove, function (error, removed) {
        if(error) {
            console.warn(error);
        } else {
            console.log(removed);
        }
        ConsumerManager.consumer.aggregate.removeTopics([AGGREGATED_PREFIX + topicSuffix], function (error, removed) {
            if(error) {
                console.warn(error);
            } else {
                console.log(removed);
            }
        })
    })
    /*this.consumer.admin.removeTopics(['MONITOR_' + topicSuffix,'MONITOR_AGGREGATED_' + topicSuffix], (err, removed) => {
        // result is an array of any errors if a given topic could not be created
        console.log('removedTopics: ',removed)
    })*/
}
ConsumerManager.initConsumers = function() {
    console.log("Init Consumers")
    ConsumerManager.initAggregateConsumer();
    ConsumerManager.initMonitorConsumer();
}

ConsumerManager.updateOffsets = function( callbackFunction ) {
    console.log("updatingOffsets:")
    let promise = new Promise(function(resolve, reject){
        let topics = [];
        for( let topicSuffix of ConsumerManager.subscribedTopics.keys() ) {
            topics.push(AGGREGATED_PREFIX + topicSuffix);
            topics.push(MONITOR_PREFIX + topicSuffix);
        }
        console.log(ConsumerManager.subscribedTopics)
        ConsumerManager.consumer.offset.fetchLatestOffsets( topics, function (error, offsets) {
            if(error) {
                console.warn("fetchLatestOffsets ERROR: ",error)
            }
            console.log("fetchLatestOffsets: ", offsets)
            let partition = 0;
            for (let topic of topics) {
                ConsumerManager.offsetsSubscribedTopics.set(topic,offsets[topic][partition])
            }
            resolve();
        })
    })
    promise.then(
        function(result){callbackFunction()},
        function(error){
            console.warn("UpdateOffset Failed")
        }
    )
}
ConsumerManager.addConsumer = function(topicSuffix) {
    //this.initTopic([topicSuffix]);
    let monitorFetchRequest = {
        topic: MONITOR_PREFIX + topicSuffix,
        partition:0,
        offset: ConsumerManager.offsetsSubscribedTopics.get(MONITOR_PREFIX + topicSuffix),
    }

    this.consumer.monitor.addTopics([monitorFetchRequest], function (err, added) {
        if(err) {
            console.warn(err);
        }
        console.log(added);
    }, true);

    let aggregateFetchRequest = {
        topic: AGGREGATED_PREFIX + topicSuffix,
        partition:0,
        offset: ConsumerManager.offsetsSubscribedTopics.get(AGGREGATED_PREFIX + topicSuffix),
    }

    this.consumer.aggregate.addTopics([aggregateFetchRequest], function (err, added) {
        if(err) {
            console.warn(err);
        }
        console.log(added)
    }, true);
}

ConsumerManager.initMonitorConsumer = function() {
    let fetchRequests = new Array()
    for(let topic of ConsumerManager.subscribedTopics.keys()) {
        fetchRequests.push({
            topic: MONITOR_PREFIX + topic,
            partition: 0,
            offset: ConsumerManager.offsetsSubscribedTopics.get(MONITOR_PREFIX + topic),
        })
    }
    try {
        // Consumer = kafka.Consumer;
        this.consumer.monitor = new kafka.Consumer(ConsumerManager.clients.monitor, fetchRequests/*[{ topic: "MONITOR_AGGREGATED_liveTrainDataStream", partition: 0/!*, offset: 0*!/ }]*/, {
            autocommit: true,
            autoCommitIntervalMs: 5000,
            encoding: 'buffer',
            // keyEncoding: 'utf8',
            fromOffset: /*'latest'*/true,
        });
    } catch (e) {
        console.log(e)
    }

    this.consumer.monitor.on("message", function (message) {
        // console.log("message",message);
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
    console.log("Init Aggregation Consumers")
    let fetchRequests = new Array()
    for(let topic of ConsumerManager.subscribedTopics.keys()) {
        fetchRequests.push({
            topic: AGGREGATED_PREFIX + topic,
            partition: 0,
            offset: ConsumerManager.offsetsSubscribedTopics.get(AGGREGATED_PREFIX + topic),
        })
    }
    console.log("fetchRequest: ", fetchRequests)
    try {
        // Consumer = kafka.Consumer;
        this.consumer.aggregate = new kafka.Consumer(
            ConsumerManager.clients.aggregate,
            fetchRequests,
            {
            autocommit: true,
            autoCommitIntervalMs: 5000,
            encoding: 'buffer',
            // keyEncoding: 'utf8',
            fromOffset: /*'latest'*/true,
            });
    } catch (e) {
        console.log(e)
    }

    this.consumer.aggregate.on("message", function (message) {
        // console.log("message",message);
        var buf = Buffer.from(message.value, 'binary');

        var decodedMessage = aggregateEvent.Aggregate.deserializeBinary(buf);
        // console.log("decodedMessage",decodedMessage)
        console.log(message.topic,"value",decodedMessage.getVolume(), "time",decodedMessage.getTime())
        let kafkaMessage = new Object({
            topic: message.topic,
            value: decodedMessage.getVolume(),
            time: decodedMessage.getTime()
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
    console.log("SubscribedTopics Size: ",ConsumerManager.subscribedTopics.size)
    if(ConsumerManager.subscribedTopics.size === 0) {
        console.log("Initialize SubscribedTopics MAP")
        // this.updateSubscribedTopics(topicSuffix, false)
        ConsumerManager.subscribedTopics.set(topicSuffix,1)
        //TODO add live2MonitoringMode or move to start Monitoring
        ConsumerManager.initTopics(
            ConsumerManager.subscribedTopics.keys(), function () {
                return ConsumerManager.updateOffsets(ConsumerManager.initConsumers)
            }
        )
        // this.initConsumers();
    } else {
        ConsumerManager.updateSubscribedTopics(topicSuffix, false)
    }
}
ConsumerManager.removeFromSubscribedTopic = function(topicSuffix) {
    ConsumerManager.updateSubscribedTopics(topicSuffix, true)
    if(ConsumerManager.subscribedTopics.get(topicSuffix) === 0) {
        ConsumerManager.removeTopic(topicSuffix)
    }
}
ConsumerManager.updateSubscribedTopics = function(topicSuffix, remove) {
    console.log("updateConsumers: " + topicSuffix, "removed: " +remove);
    let currentSubscriberCount = ConsumerManager.subscribedTopics.get(topicSuffix)
    if(remove) {
        if(currentSubscriberCount === 1) {
            ConsumerManager.subscribedTopics.delete(topicSuffix)
            // this.removeTopic(topicSuffix);
        } else if(currentSubscriberCount > 1) {
            ConsumerManager.subscribedTopics.set( topicSuffix, currentSubscriberCount - 1 );
        }
    } else {
        if(currentSubscriberCount == null) {
            currentSubscriberCount = 0;
            ConsumerManager.subscribedTopics.set( topicSuffix, currentSubscriberCount + 1);
            // /TODO add live2MonitoringMode or move to start Monitoring
            ConsumerManager.initTopics(
                [topicSuffix],
                function () {
                    return ConsumerManager.updateOffsets(function(){
                        return ConsumerManager.addConsumer(topicSuffix)
                    })
                }
            )
        } else {
            ConsumerManager.subscribedTopics.set( topicSuffix, currentSubscriberCount + 1);
        }
    }
}
module.exports = ConsumerManager;