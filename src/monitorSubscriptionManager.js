// import kafka from "kafka-node";
// import socket from "socket.io"
// import protobuf from "protobufjs"
import * as constants from "./constants.js"
// import moment from "moment"
export const MonitorSubscriptionManager = new Object();
MonitorSubscriptionManager.registry = new Object({
    streamToLinksLookup: new Map(),
    linkRegister: new Map(),
}) ;
MonitorSubscriptionManager.startListeners = function() {
    socket.on("kafkaMonitor", function (kafkaMessage) {
        console.log(kafkaMessage);
        MonitorSubscriptionManager.distributeEvents(kafkaMessage, false);
    });
    socket.on("kafkaAggregated", function (kafkaMessage) {
        console.log(kafkaMessage);
        MonitorSubscriptionManager.distributeEvents(kafkaMessage, true);
    });
}
MonitorSubscriptionManager.distributeEvents = function(kafkaMessage, aggregated) {
    let topic = kafkaMessage.topic;
    // let aggregated = topic.startsWith(constants.AGGREGATED_PREFIX);
    let topicSuffix;
    if( aggregated ) {
        topicSuffix = topic.replace(constants.AGGREGATED_PREFIX,"")
    } else {
        topicSuffix = topic.replace(constants.MONITOR_PREFIX,"")
    }
    let subScribedLinks = this.registry.streamToLinksLookup.get(topicSuffix)
    if (aggregated) {
        for(let linkKey of subScribedLinks) {
            this.processAggregationEvent(linkKey,kafkaMessage.value);
            //testing purposes only
            this.processMonitorEvent(linkKey)
        }
    } else {
        for(let linkKey of subScribedLinks) {
            this.processMonitorEvent(linkKey)
        }
    }

}
MonitorSubscriptionManager.processAggregationEvent= function(linkKey,eventCount) {
    let monitorObject = this.registry.linkRegister.get(linkKey)
    monitorObject.chart.config.data.datasets.forEach((dataset) =>{
        //TODO think about labels and order
        let length = dataset.data.length;
        // let labelArray = [5,10,15,20,25,30,35,40,45,50,55,60]
        if (length >= 12) {
            dataset.data.shift()
        } /*else {
            monitorObject.chart.config.data.labels.unshift(labelArray[length])
        }*/
        dataset.data.push(
            {
                x: new Date(),
                y: eventCount,
            })
    })
    monitorObject.chart.update();
}
MonitorSubscriptionManager.processMonitorEvent= function(linkKey) {
    let monitorObject = this.registry.linkRegister.get(linkKey)
    monitorObject.link.appendLabel({
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
    let labelIndex = monitorObject.link.labels().length -1;
    let endOfPath = 1; //distance parameter [0-1]
    monitorObject.link.transition('labels/' + labelIndex + '/position/distance',endOfPath, {
        delay: 200,
        duration: 1000,
        valueFunction: joint.util.interpolate.number,
        timingFunction: joint.util.timing.linear
    });

}
MonitorSubscriptionManager.initChart= function(canvasContainerId) {
    let canvasContainer = $('#'+canvasContainerId+'');
    let canvasArray = canvasContainer.children('canvas')
    if(canvasArray.length === 0 /*!canvasContainer.has('canvas')*/) {
        canvasContainer.append('<canvas width="200" height="60" style="position: absolute;z-index:100;width:200px;height:60px;"></canvas> ');
    } else {
        console.warn("Already has Canvas: "+ canvasContainerId)
    }
    let ctx = canvasContainer.children('canvas')[0].getContext('2d');

    /* Chart Configuration */
    let chartConfig = {
        type : 'line',
        data : {
            labels : []/*[5,10,15,20,25,30,35,40,45,50,55,60]*/,
            datasets : [ {
                // label : 'EventCountPer5Sec',
                backgroundColor : 'rgb(255, 99, 132)',
                borderColor : 'rgb(255, 99, 132)',
                data : [],
                fill : true
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
                axis: 'x'
            },
            // hover : {
            //     mode : 'nearest',
            //     intersect : true
            // },
            scales : {
                xAxes : [ {
                    display : true,
                    type : 'time',
                    time : {
                        displayFormats : {
                            second : 'm:ss'
                        },
                    },
                    // distribution: 'series',
                    scaleLabel : {
                        display : false,
                        labelString : 'seconds',
                        padding: 0,
                    },
                    ticks: {
                        beginAtZero: false,
                        /*max: 60,
                        min: 0,
                        stepSize: 10,
                        autoSkip: false,*/
                        maxTicks: 3,
                        mirror: true,
                        source: 'data',
                        autoSkip: true,
                    }
                } ],
                yAxes : [ {
                    display : true,
                    scaleLabel : {
                        display : false,
                        padding: 0,
                        // labelString : 'Value'
                    },
                    ticks:{
                        beginAtZero: true,
                        autoSkip: true,
                        source: 'data',
                        stepSize: 5,
                        maxTicks: 3,
                    }
                } ]
            }
        }
    };

    let myChart = new Chart(ctx, chartConfig );
    return myChart
}
MonitorSubscriptionManager.registerConsumer = function (link ) {
    let canvasContainerId = link.attr('canvasContainer/id');
    console.log(canvasContainerId);
    let myChart;
    let myMonitorObject = new Object();
    if( canvasContainerId == null) {
        canvasContainerId = joint.util.uuid();
        console.log(canvasContainerId);
        link.attr('canvasContainer/id', canvasContainerId);
        myChart = this.initChart(canvasContainerId)
    } /*else {
        //TODO check for already Registered MonitorObject
        if(this.registry.linkRegister.has(canvasContainerId)){
            myMonitorObject = this.registry.linkRegister.get(canvasContainerId)

        } else {
            //no object registered
            myChart = this.initChart(canvasContainerId)
        }
    }*/

    //TODO check if Link Already has a canvas

    myMonitorObject = {
        streamName: link.attr('streamLabel/text'),
        chart: myChart,
        link: link,
    }
    this.registerMonitorObject(myMonitorObject);

}
MonitorSubscriptionManager.updateMonitorObjectRegistry = function(link) {

}

MonitorSubscriptionManager.registerLinkKeyOnStreamLookup = function (linkKey, newStreamName) {
    let streamLinkSet = new Set();
    streamLinkSet.add(linkKey);
    this.registry.streamToLinksLookup.set(newStreamName,streamLinkSet);
}

MonitorSubscriptionManager.registerMonitorObject = function (monitorObject) {
    let linkKey = monitorObject.link.attr('canvasContainer/id');
    let newStreamName = monitorObject.streamName;
    let oldStreamName;
    if(this.registry.linkRegister.has(linkKey)) {
        //Link is already registered
        console.log('Link'+ linkKey +' is already registered');
        let oldMonitorObject = this.registry.linkRegister.get(linkKey);
        oldStreamName = oldMonitorObject.streamName;
        if (oldStreamName !== newStreamName) {
            if (this.registry.streamToLinksLookup.has(newStreamName)) {
                // new Stream is already subscribed by someone
                console.log("new Stream is already subscribed by someone")
                let streamLinkSet = this.registry.streamToLinksLookup.get(newStreamName);
                if(!streamLinkSet.has(linkKey)) {
                    // but not by this link
                    console.log("but not by this link")
                    streamLinkSet.add(linkKey)
                    this.unregisterLinkFromStream(linkKey,oldStreamName)
                    /*let oldStreamLinkSet = this.registry.streamToLinksLookup.get(oldStreamName);
                    oldStreamLinkSet.delete(linkKey)
                    socket.emit('deleteConsumer', oldStreamName);*/
                    console.log("Socket.io registerConsumer: ",newStreamName)
                    socket.emit('registerConsumer', newStreamName);
                } else {
                    //No need to change
                    console.log("No need To Change Consumer Registry")
                }
            } else {
                // new Stream is not already subscribed by anyone
                console.log("new Stream is not already subscribed by anyone")
                this.registerLinkKeyOnStreamLookup(linkKey, newStreamName)
                this.unregisterLinkFromStream(linkKey,oldStreamName)
                /*let oldStreamLinkSet = this.registry.streamToLinksLookup.get(oldStreamName);
                oldStreamLinkSet.delete(linkKey)
                socket.emit('deleteConsumer', oldStreamName);*/
                console.log("Socket.io registerConsumer: ",newStreamName)
                socket.emit('registerConsumer', newStreamName);
            }
        } else {
            //No need to change
        }
    } else {
        //Link gets registered the first time
        console.log("Link gets registered the first time")
        this.registerLinkKeyOnStreamLookup(linkKey, newStreamName)
        console.log("Socket.io registerConsumer: ",newStreamName)
        socket.emit('registerConsumer', newStreamName);
        //this should be initiated only once per link
        monitorObject.link.on('transition:end', function(link){
            //0 is default label
            //the 1 is always the label that finishes first
            //link.removeLabel(1)
        })
    }
    this.registry.linkRegister.set(linkKey,monitorObject)
}
MonitorSubscriptionManager.unregisterLinkFromStream = function (linkKey, oldStreamName) {
    let oldStreamLinkSet = this.registry.streamToLinksLookup.get(oldStreamName);
    oldStreamLinkSet.delete(linkKey)
    socket.emit('deleteConsumer', oldStreamName);
}
// module.exports = Subscriber;