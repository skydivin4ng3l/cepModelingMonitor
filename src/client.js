import {CustomLink} from "./customlink.js";
import {EditorEvents} from "./editorEvents.js";

var CEPMOMO = new Object();
CEPMOMO.initializeCEPMOMO = function(editorMain,editorMini){
    // var CustomLink = require("customlink");

    var graph = new joint.dia.Graph();

    var editorHeight = window.innerHeight*0.75;
    var editorWidth = window.innerWidth;

    // editorMain
    var paper = new joint.dia.Paper({
        el: editorMain,
        model: graph,
        width: editorWidth,
        height: editorHeight,
        gridSize: 10,
        drawGrid: true,
        background: {
            color: 'white'
        }
    });


    // editorMini
    var paperSmall = new joint.dia.Paper({
        el: editorMini,
        model: graph,
        width: editorWidth*0.1,
        height: editorHeight*0.1,
        gridSize: 1,
        interactive: false,
        background: {
            color: 'rgba(189,189,189,0.5)'
        }
    });
    paperSmall.scale(0.1);

    //InfoBox
    var info = new joint.shapes.standard.Rectangle();
    info.position(editorWidth / 2 - 50, 10);
    info.resize(100, 20);
    info.attr({
        body: {
            visibility: 'hidden',
            cursor: 'default',
            fill: 'white',
            stoke: 'black'
        },
        label: {
            visibility: 'hidden',
            text: 'Link clicked',
            cursor: 'default',
            fill: 'black',
            fontSize: 12
        }
    });
    info.addTo(graph);
    EditorEvents.init(paper, info);
    //other
    var rect = new joint.shapes.standard.Rectangle();
    rect.position(100, 30);
    rect.resize(100, 40);
    rect.attr({
        body: {
            fill: "blue",
            strokeDasharray: '10,2'
        },
        label: {
            text: "Hello",
            fill: "white",
        },
    });
    rect.addTo(graph);

    var rect2 = rect.clone();
    rect2.translate(300, 0);
    rect2.attr("label/text", "Wolrd!");
    rect2.addTo(graph);

    var normallink = new joint.shapes.standard.Link();
    normallink.source(rect);
    normallink.target(rect2);
    normallink.addTo(graph);

    // var link = new CustomLink();
    // link.attr({
    //     offsetLabelAbsolute: {
    //         atConnectionRatioIgnoreGradient: 0.66,
    //         x: -40,
    //         y: 80,
    //         text: 'ignoreGradient: -40,80'
    //     },
    //     offsetLabelAbsoluteBody: {
    //         atConnectionRatioIgnoreGradient: 0.66,
    //         x: -110, // -40 + -70
    //         y: 70 // 80 + -10
    //     }
    // });
    // link.source(rect);
    // link.target(rect2);
    // link.addTo(graph);

    socket.on("kafka", function (msg) {
        link.attr("label/text", msg);
    });

    socket.on("chat message", function (msg) {
        rect2.attr("label/text", msg);
    });
    var link = new CustomLink();
    link.source(new g.Point(100, 110));
    link.target(new g.Point(500, 110));
    link.vertices([{ x: 300, y: 190 }]);
    link.attr({
        // relativeLabel: {
        //     atConnectionRatio: 0.25,
        //     text: '0.25'
        // },
        // relativeLabelBody: {
        //     atConnectionRatio: 0.25
        // },
        // absoluteLabel: {
        //     atConnectionLength: 150,
        //     text: '150'
        // },
        // absoluteLabelBody: {
        //     atConnectionLength: 150
        // },
        // absoluteReverseLabel: {
        //     atConnectionLength: -100,
        //     text: '-100'
        // },
        // absoluteReverseLabelBody: {
        //     atConnectionLength: -100
        // },
        // offsetLabelPositive: {
        //     atConnectionRatio: 0.66,
        //     y: 40,
        //     text: 'keepGradient: 0,40'
        // },
        // offsetLabelPositiveBody: {
        //     atConnectionRatio: 0.66,
        //     x: -60, // 0 + -60
        //     y: 30 // 40 + -10
        // },
        // offsetLabelNegative: {
        //     atConnectionRatio: 0.66,
        //     y: -40,
        //     text: 'keepGradient: 0,-40'
        // },
        // offsetLabelNegativeBody: {
        //     atConnectionRatio: 0.66,
        //     x: -60, // 0 + -60
        //     y: -50 // -40 + -10
        // },
        offsetLabelAbsolute: {
            atConnectionRatioIgnoreGradient: 0.66,
            x: -40,
            y: 80,
            text: 'ignoreGradient: -40,80'
        },
        offsetLabelAbsoluteBody: {
            atConnectionRatioIgnoreGradient: 0.66,
            x: -110, // -40 + -70
            y: 70 // 80 + -10
        }
    });
    //link.addTo(graph);

    function contract(link) {
        link.transition('source', { x: 200, y: 110 }, {
            delay: 1000,
            duration: 4000,
            timingFunction: function(time) {
                return (time <= 0.5) ? (2 * time) : (2 * (1 - time));
            },
            valueFunction: joint.util.interpolate.object
        });

        link.transition('target', { x: 400, y: 110 }, {
            delay: 1000,
            duration: 4000,
            timingFunction: function(time) {
                return (time <= 0.5) ? (2 * time) : (2 * (1 - time));
            },
            valueFunction: joint.util.interpolate.object
        });

        link.oscillateToggle = true;
    }

    function oscillate(link) {
        link.transition('source', { x: 100, y: 190 }, {
            delay: 1000,
            duration: 4000,
            timingFunction: function(time) {
                return (time <= 0.5) ? (2 * time) : (2 * (1 - time));
            },
            valueFunction: joint.util.interpolate.object
        });

        link.transition('vertices/0', { x: 300, y: 110 }, {
            delay: 1000,
            duration: 4000,
            timingFunction: function(time) {
                return (time <= 0.5) ? (2 * time) : (2 * (1 - time));
            },
            valueFunction: joint.util.interpolate.object
        });

        link.transition('target', { x: 500, y: 190 }, {
            delay: 1000,
            duration: 4000,
            timingFunction: function(time) {
                return (time <= 0.5) ? (2 * time) : (2 * (1 - time));
            },
            valueFunction: joint.util.interpolate.object
        });

        link.oscillateToggle = false;
    }

    link.currentTransitions = 0;
    link.oscillateToggle = 0;

    contract(link);

    link.on('transition:start', function(link) {
        link.currentTransitions += 1;
    });

    link.on('transition:end', function(link) {
        link.currentTransitions -= 1;

        if (link.currentTransitions === 0) {
            if (link.oscillateToggle) oscillate(link);
            else contract(link);
        }
    });

}
CEPMOMO.initializeCEPMOMO(document.getElementById("paper-main-window"),document.getElementById("paper-minimap-window"));
