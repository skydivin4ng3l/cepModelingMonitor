// import kafka from "kafka-node";
// import socket from "socket.io"
// import protobuf from "protobufjs"
export const MonitorSubscriptionManager = new Object();
MonitorSubscriptionManager.registry = new Object({
    streamToLinksLookup: new Map(),
    linkRegister: new Map(),
}) ;
MonitorSubscriptionManager.startListener = function() {
    socket.on("kafka", function (msg) {
        console.log(msg);
    });
}
// Subscriber.ini = function (io, kafka, aggregateEvent) {
//
//
//
//     // const io = socket(server);
//     const client = new kafka.KafkaClient({ kafkaHost: "localhost:29092" });
//     const admin = new kafka.Admin(client);
//     var topics = [{
//         topic: 'MONITOR_AGGREGATED_liveTrainDataStream',
//         partitions: 1,
//         replicationFactor: 1
//     }];
//     admin.createTopics(topics, (err, res) => {
//         // result is an array of any errors if a given topic could not be created
//         console.log('creatingTopics',res)
//     });
//     admin.listTopics((err, res) => {
//         console.log('topics', res);
//     });
//     try {
//         Consumer = kafka.Consumer;
//         consumer = new Consumer(client, [{ topic: "MONITOR_AGGREGATED_liveTrainDataStream", partition: 0/*, offset: 0*/ }], {
//             autocommit: false,
//             encoding: 'buffer',
//             // keyEncoding: 'utf8',
//             fromOffset: 'latest'/*true*/,
//         });
//     } catch (e) {
//         console.log(e)
//     }
//
//
//
//     consumer.on("message", function (message) {
//         console.log("message",message);
//         var buf = Buffer.from(message.value, 'binary');
//
//         var decodedMessage = aggregateEvent.Aggregate.deserializeBinary(buf);
//         console.log("decodedMessage",decodedMessage)
//         console.log(message.topic,"value",decodedMessage.getVolume())
//
//         io.emit("kafka", decodedMessage.getVolume());
//
//     });
//
//     io.on("connection", (socket) => {
//         console.log("a user connected");
//         socket.on("disconnect", () => {
//             console.log("user disconnected");
//         });
//         socket.on("chat message", (msg) => {
//             console.log("message: " + msg);
//         });
//         socket.on('registerConsumer',(link) =>{
//             console.log("link: " + link);
//             this.registerConsumer(link);
//         })
//     });
//     io.on("connection", (socket) => {
//         socket.on("chat message", (msg) => {
//             io.emit("chat message", msg);
//         });
//     });
// }
MonitorSubscriptionManager.registerConsumer = function (link ) {
    var id = link.attr('canvasContainer/id');
    console.log(id);
    if( id == null) {
        id = joint.util.uuid();
    }

    console.log(id);
    link.attr('canvasContainer/id', id);
    //TODO check if Link Already has a canvas
    var canvasContainer = $('#'+id+'').append('<canvas width="200" height="40" style="position: absolute;z-index:100;width:200px;height:40px;"></canvas> ');
    // var canvasId = canvasContainer.children('canvas').attr('id')
    var ctx = canvasContainer.children('canvas')[0].getContext('2d');

    // var ctx = $('#'+canvasId+'')[0].getContext('2d');
    /* Chart Configuration */
    var chartConfig = {
        type : 'line',
        data : {
            labels : [5,10,15,20,25,30,35,40,45,50,55,60],
            datasets : [ {
                // label : 'EventCountPer5Sec',
                backgroundColor : 'rgb(255, 99, 132)',
                borderColor : 'rgb(255, 99, 132)',
                data : [5,0,17,5,0],
                fill : false
            } ]
        },
        options : {
            legend: {
                display: false
            },
            responsive : true,
            title : {
                display : false,
                text : 'EventCountPer5Sec'
            },
            tooltips : {
                mode : 'index',
                // intersect : false,
                axis: 'y'
            },
            // hover : {
            //     mode : 'nearest',
            //     intersect : true
            // },
            scales : {
                xAxes : [ {
                    display : true,
                    // type : 'category',
                    // time : {
                    //     displayFormats : {
                    //         second : 'ss'
                    //     },
                    // },
                    // distribution: 'series',
                    scaleLabel : {
                        display : false,
                        labelString : 'seconds',
                        padding: 0,
                    },
                    ticks: {
                        beginAtZero: false,
                        max: 60,
                        min: 0,
                        stepSize: 10,
                        autoSkip: true,
                        maxTicks: 6
                    }
                } ],
                yAxes : [ {
                    display : true,
                    scaleLabel : {
                        display : false,
                        padding: 0,
                        // labelString : 'Value'
                    },

                } ]
            }
        }
    };

    var myChart = new Chart(ctx, chartConfig );
    var myMonitorObject = {
        streamName: link.attr('streamLabel/text'),
        chart: myChart,
        link: link,
    }
    this.registerMonitorObject(myMonitorObject);

    socket.emit('registerConsumer', link.attr('streamLabel/text'));
    //TODO do this differently
    socket.on(link.attr('streamLabel/text'), (kafkaEvent) => {
        console.log(kafkaEvent);
        link.appendLabel({
            markup: [
                {
                    tagName: 'circle',
                    selector: 'body'
                }
            ],
            attrs: {
                body: {
                    fill: '#ffffff',
                    stroke: '#000000',
                    strokeWidth: 1,
                    r: 5
                }
            },
            position: {
                distance: 0
            }
        });
        let labelIndex = link.labels().length;
        link.transition('labels/' + labelIndex + '/position/distance',1, {
            delay: 100,
            duration: 500,
            valueFunction: joint.util.interpolate.number,
            timingFunction: joint.util.timing.linear
        });
    });
}

MonitorSubscriptionManager.registerLinkKeyOnStreamLookup = function (linkKey, newStreamName) {
    let streamLinkSet = new Set();
    streamLinkSet.add(linkKey);
    this.registry.streamToLinksLookup.set(newStreamName,streamLinkSet);
}

MonitorSubscriptionManager.registerMonitorObject = function (monitorObject) {
    let linkKey = monitorObject.link.attr('canvasContainer/id');
    let newStreamName = monitorObject.streamName;
    if(this.registry.linkRegister.has(linkKey)) {
        //Link is already registered
        //TODO Update StreamToLinkLookup
        let oldMonitorObject = this.registry.linkRegister.get(linkKey);
        if (oldMonitorObject.streamName != newStreamName) {
            if (this.registry.streamToLinksLookup.has(newStreamName)) {
                // new Stream is already subscribed by someone
                let streamLinkSet = this.registry.streamToLinksLookup.get(newStreamName);
                if(!streamLinkSet.has(linkKey)) {
                    // but not by this link
                    streamLinkSet.add(linkKey)
                    let oldStreamLinkSet = this.registry.streamToLinksLookup.get(oldMonitorObject.streamName);
                    oldStreamLinkSet.delete(linkKey)
                }
            } else {
                // new Stream is not already subscribed by anyone
                this.registerLinkKeyOnStreamLookup(linkKey, newStreamName)
            }
        }
    } else {
        //Link gets registered the first time
        this.registerLinkKeyOnStreamLookup(linkKey, newStreamName)
        //this should be initiated only once
        monitorObject.link.on('transition:end', function(link){
            //0 is default label
            //the 1 is always the label that finishes first
            link.removeLabel(1)
        })
    }
    this.registry.linkRegister.set(linkKey,monitorObject)
}
// module.exports = Subscriber;