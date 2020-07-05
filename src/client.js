// import {CEPLink} from "./customlink.js";
import {EditorEvents} from "./editorEvents.js";
import {CepElements} from "./cepElement.js";

export const CEPMODEMON = new Object();
CEPMODEMON.initNavBar = function() {
    let navBar = $('#navBar');
    navBar.append([
        '<button type="button" id="saveButton" class="saveButton" >Save</button>',
        '<button type="button" id="loadButton" class="loadButton" >Load</button>',
        '<button type="button" id="monitorStartButton"  class="monitorStartButton" > Start Monitoring</button>',
        '<button type="button" id="monitorStopButton" class="monitorStopButton" > Stop Monitoring</button>',
    ].join(''))
    $('#saveButton').bind('click', CEPMODEMON.navSaveButton);
    $('#loadButton').bind('click', CEPMODEMON.navLoadButton);
    $('#monitorStartButton').bind('click', CEPMODEMON.navStartMonitoringButton);
    $('#monitorStopButton').bind('click', CEPMODEMON.navStopMonitoringButton);
}
CEPMODEMON.saveToFile= function(content, fileName, contentType){
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href)
}
CEPMODEMON.navSaveButton = function(){
    console.log("Save Button clicked");
    let graphJsonObject = CEPMODEMON.graph.toJSON();
    CEPMODEMON.saveToFile(JSON.stringify(graphJsonObject),'graph.json','application/json');
}
CEPMODEMON.navLoadButton = function(){
    console.log("Load Button clicked");
    $('#container').append(
        [
            '<div class="fileInputContainer" id="fileInputContainer" style="position: absolute;z-index: 100;width: 500px;top:10%;left: 10%;">',
            '<form class="fileInputForm">',
            '<input type="file" id="fileInput" accept="application/json">',
            '<input type="button" class="fileInputOk" id="fileInputOk" value="Ok">',
            '</form>',
            '</div>',
        ].join('')
    );
    let loadedFile;
    $('#fileInputOk').on('click', function () {
        loadedFile = $('#fileInput')[0].files[0];
        $('#fileInputOk').off('click');

        if (loadedFile) {
            var readFile = new FileReader();
            readFile.onload = function(e) {
                var contents = e.target.result;
                var json = JSON.parse(contents);
                alert_data(json);
            };
            readFile.readAsText(loadedFile);
        } else {
            console.log("Failed to load file");
        }
        function alert_data(json) {
            console.warn(json)
            CEPMODEMON.graph.fromJSON(json);
        }
        // let parsedJson = JSON.parse(JSON.stringify(loadedFile))

        $('#fileInputContainer').remove();
    })
}
CEPMODEMON.navStartMonitoringButton = function(){
    console.log("Monitoring Start Button clicked");
}
CEPMODEMON.navStopMonitoringButton = function(){
    console.log("Monitoring Stop Button clicked");
}
CEPMODEMON.initializeCEPMODEMON = function(editorMain, editorMini){
    this.initNavBar();

    CepElements.init();

    CEPMODEMON.graph = new joint.dia.Graph();

    var editorHeight = window.innerHeight*0.75*2;
    var editorWidth = window.innerWidth*2;


    // editorMain
    var paper = new joint.dia.Paper({
        el: editorMain,
        model: this.graph,
        width: editorWidth,
        height: editorHeight,
        gridSize: 10,
        drawGrid: true,
        background: {
            color: 'white'
        },
        snapLinks: true,
        // preventContextMenu: false,
        linkPinning: false,
        defaultLink: new /*joint.dia.Link()*/joint.shapes.cep.Link(),
        validateConnection: function(cellViewS, magnetS, cellViewT, magnetT) {
            // Prevent linking from input ports.
            if (magnetS && magnetS.getAttribute('port-group') === 'in') return false;
            // Prevent linking from output ports to input ports within one element.
            if (cellViewS === cellViewT) return false;
            // Prevent linking to input ports.
            return magnetT && magnetT.getAttribute('port-group') === 'in';
        },
        // Enable marking available cells & magnets
        markAvailable: true
    });


    // editorElementToolBar
    var editorElementToolBarGraph = new joint.dia.Graph,
        editorElementToolBarPaper = new joint.dia.Paper({
            el: $('#editorElementToolBar'),
            height: window.innerHeight*0.23,
            width: editorWidth,
            model: editorElementToolBarGraph,
            interactive: false
        });

    // Single port definition
    var portOut1 = {
        // id: 'abc', // generated if `id` value is not present
        group: 'out',
        args: {}, // extra arguments for the port layout function, see `layout.Port` section
        label: {
            /*position: {
                name: 'right',
                args: { /!*y: 6 *!/ x: 18} // extra arguments for the label layout function, see `layout.PortLabel` section
            },*/
            markup: '<text class="label-text" fill="blue"/>'
        },
        attrs: {
            text: { text: 'out' },
            position: {
                name: 'right'
            },
            magnet: true,
        },
        markup: '<rect width="16" height="16" y="-8" fill="#fff" />',
        Z: 'auto'
    };
    let portFilterInOut = JSON.parse(JSON.stringify(portOut1));
    portFilterInOut.markup= '<rect width="16" height="16" y="-8" fill="green" />';
    portFilterInOut.label.markup = '<text class="label-text" fill="green" font-size="12"/>'
    portFilterInOut.attrs.text.text = 'true';
    let portFilterOutOut = JSON.parse(JSON.stringify(portOut1));
    portFilterOutOut.markup= '<rect width="16" height="16" y="-8" fill="red" />';
    portFilterOutOut.label.markup = '<text class="label-text" fill="red" font-size="12"/>'
    portFilterOutOut.attrs.text.text = 'false';
    let portFilterNotFilterableOut = JSON.parse(JSON.stringify(portOut1));
    portFilterNotFilterableOut.markup= '<rect width="16" height="16" y="-8" fill="black" />';
    portFilterNotFilterableOut.label.markup = '<text class="label-text" fill="black" font-size="12" />'
    portFilterNotFilterableOut.attrs.text.text = 'non';

    var portIn1 = {
        // id: 'abc', // generated if `id` value is not present
        group: 'in',
        args: {}, // extra arguments for the port layout function, see `layout.Port` section
        label: {
            /*position: {
                name: 'left',
                args: { x: -22 } // extra arguments for the label layout function, see `layout.PortLabel` section
            },*/
            markup: '<text class="label-text" fill="blue"/>'
        },
        attrs: {
            text: { text: 'in' },
            position: {
                name: 'left'
            },
            magnet: 'passive',
        },
        markup: '<circle/>',
        Z: 'auto'
    };




    var epa_source = new joint.shapes.cep.Element({
        position: {
            x: 10,
            y: 10,
        },
        size: {
            width: 100,
            height: 130,
        },
        producerType: 'Sensor',
        template: [
            '<div class="epa-element" >',
            '<h4 style="background: gold"> Source </h4>',
            '<form>',
                '<label for="sourceName">SourceName:</label>',
                '<input type="text" name="sourceName"><br>',
                '<label for="eventType">EventType:</label>',
                '<input type="text" name="eventType"><br>',
                '<label for="producerType">ProducerType:</label>',
                '<select name="producerType">',
                    '<option>Detector</option>',
                    '<option>Sensor</option>',
                '</select><br>',
            '</form>',
            '</div>'
        ].join(''),
    });
    epa_source.addPort(portOut1)

    var epa_sink = new joint.shapes.cep.Element({
        position: {
            x: 180,
            y: 10,
        },
        size: {
            width: 100,
            height: 130,
        },
        sinkName: 'change me',
        consumerType: 'Software',
        template: [
            '<div class="epa-element" >',
            '<h4 style="background: darkorange"> Sink </h4>',
            '<form>',
            '<label for="sinkName">SinkName:</label>',
            '<input type="text" name="sinkName"><br>',
            '<label for="destination">Destination:</label>',
            '<input type="text" name="destination"><br>',
            '<label for="consumerType">ConsumerType:</label>',
            '<select name="consumerType">',
            '<option>Hardware</option>',
            '<option>Human Interaction</option>',
            '<option>Software</option>',
            '</select><br>',
            '</form>',
            '</div>'
        ].join(''),
    });
    epa_sink.addPort(portIn1)

    var epa_filter = new joint.shapes.cep.Element({
        position: {
            x: 320,
            y: 10,
        },
        size: {
            width: 100,
            height: 120,
        },
        template: [
            '<div class="epa-element" >',
            '<h4 style="background: coral"> Filter </h4>',
            '<form>',
            '<label for="filterFunction">FilterFunction:</label>',
            '<textarea name="filterFunction" rows="5" placeholder="event.count>50"></textarea>',
            '</form>',
            '</div>'
        ].join(''),
    });

    epa_filter.addPorts([portIn1,portFilterInOut,portFilterOutOut,portFilterNotFilterableOut])

    var epa_translate = new joint.shapes.cep.Element({
        position: {
            x: 460,
            y: 10,
        },
        size: {
            width: 120,
            height: 220,
        },
        template: [
            '<div class="epa-element" >',
            '<h4 style="background: #3498DB"> Translate </h4>',
            '<form>',
            '<label for="outputEventType">OutputEventType:</label>',
            '<input type="text" name="outputEventType"><br>',
            '<label for="referenceName">ReferenceName:</label>',
            '<input type="text" name="referenceName"><br>',
            '<label for="derivationFunction">DerivationFunction:</label>',
            '<textarea name="derivationFunction" rows="7" placeholder="Out.temperatureF := event.temperatureC * 9/5 + 32"></textarea>',
            '</form>',
            '</div>'
        ].join(''),
    });
    epa_translate.addPorts([portIn1,portOut1]);

    editorElementToolBarGraph.addCells([epa_source, epa_sink, epa_filter, epa_translate]);

    editorElementToolBarPaper.on('cell:pointerdown', function(cellView, evt, x, y) {
        $('body').append('<div id="flyPaper" style="position:fixed;z-index:100;opacity:.7;pointer-event:none;"></div>');
        // $("#flyPaper").css({"height": cellView.model.attributes.size.height,"width": cellView.model.attributes.size.width })
        var flyGraph = new joint.dia.Graph,
            flyPaper = new joint.dia.Paper({
                el: $('#flyPaper'),
                model: flyGraph,
                interactive: false,
                height: cellView.model.attributes.size.height,
                width: cellView.model.attributes.size.width,
            }),
            flyShape = cellView.model.clone(),
            pos = cellView.model.position(),
            offset = {
                x: x - pos.x,
                y: y - pos.y
            };

        flyShape.position(0, 0);
        flyGraph.addCell(flyShape);
        $("#flyPaper").offset({
            left: evt.pageX - offset.x,
            top: evt.pageY - offset.y
        });

        $('body').on('mousemove.fly', function(e) {
            $("#flyPaper").offset({
                left: e.pageX - offset.x,
                top: e.pageY - offset.y
            });
        });
        $('body').on('mouseup.fly', function(e) {
            var x = e.pageX,
                y = e.pageY,
                target = paper.$el.offset();

            // Dropped over paper ?
            if (x > target.left && x < target.left + paper.$el.width() && y > target.top && y < target.top + paper.$el.height()) {
                var s = flyShape.clone();
                s.position(x - target.left - offset.x, y - target.top - offset.y);
                CEPMODEMON.graph.addCell(s);
            }
            $('body').off('mousemove.fly').off('mouseup.fly');
            flyShape.remove();
            $('#flyPaper').remove();
        });
    });

    // editorMini conflicts with html element
    /*var paperSmall = new joint.dia.Paper({
        el: editorMini,
        model: CEPMODEMON.graph,
        width: editorWidth*0.1,
        height: editorHeight*0.1,
        gridSize: 1,
        interactive: false,
        background: {
            color: 'rgba(189,189,189,0.5)'
        }
    });
    paperSmall.scale(0.1);*/

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
    info.addTo(CEPMODEMON.graph);
    EditorEvents.init(paper, info);



    /*var html = new joint.shapes.html.Element({
        position: { x: 80, y: 80 },
        size: { width: 170, height: 100 },
        label: 'I am HTML',
            select: 'one',
        ports: {
            groups: {a:{
                position: {
                    name: 'right'
                },
                attrs: {
                    '.port-label': {
                        fill: '#000'
                    },
                    '.joint-port-body': {
                        fill: '#fff',
                        stroke: '#000',
                        r: 10,
                        magnet: true,
                    }
                },
                }}
        },
        attrs: {
           '.':{ magnet: false }
        }
    });
    html.addPort(portOut1);
    html.addTo(CEPMODEMON.graph);*/

    var cep = new joint.shapes.cep.Element();
    cep.resize(100, 100);
    cep.position(500, 610);
    cep.attr('option1/text', 'one');
    cep.attr('option2/text', 'two');
    cep.addPort(portOut1);
    cep.addPort(portIn1);
    cep.addTo(CEPMODEMON.graph);

    /*var epa = new joint.shapes.devs.Model();
    epa.position(200,40);
    epa.addInPort('in1')
    epa.addOutPort('out1')
    epa.addTo(CEPMODEMON.graph);
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
    rect.addPort(port);
    rect.addTo(CEPMODEMON.graph);

    var rect2 = rect.clone();
    rect2.translate(300, 0);
    rect2.attr("label/text", "Wolrd!");
    rect2.addTo(CEPMODEMON.graph);*/


    // var normallink = new joint.shapes.standard.Link();
    // normallink.source(rect);
    // normallink.target(rect2);
    // normallink.addTo(CEPMODEMON.graph);

    // var linkView = normallink.findView(paper);
    //linkView.addTools(toolsView);

    /*var secondLink = new joint.shapes.standard.Link();
    secondLink.source(rect);
    secondLink.target(epa);
    secondLink.addTo(CEPMODEMON.graph);
    var link = new CustomLink();
    link.attr({
        offsetLabelAbsolute: {
            atConnectionRatioIgnoreGradient: 0.66,
            // x: -40,
            // y: 80,
            text: 'ignoreGradient: -40,80'
        },
        offsetLabelAbsoluteBody: {
            atConnectionRatioIgnoreGradient: 0.66,
            // x: -110, // -40 + -70
            // y: 70 // 80 + -10
        }
    });
    link.source(rect);
    link.target(rect2);
    link.addTo(CEPMODEMON.graph);*/

    socket.on("kafka", function (msg) {
        rect.attr("label/text", msg);
    });

    socket.on("chat message", function (msg) {
        rect2.attr("label/text", msg);
    });
    /*var link = new CustomLink();
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
    //link.addTo(CEPMODEMON.graph);

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

    AnimatedLink.addTo(CEPMODEMON.graph);*/

    /*var textBlock = new joint.shapes.standard.TextBlock();
    textBlock.resize(100, 100);
    textBlock.position(250, 610);
    textBlock.attr('root/title', 'joint.shapes.standard.TextBlock');
    textBlock.attr('body/fill', 'lightgray');
    textBlock.attr('label/text', 'Hyper Text Markup Language');
// Styling of the label via `style` presentation attribute (i.e. CSS).
    textBlock.attr('label/style/color', 'red');
    textBlock.addTo(CEPMODEMON.graph);*/

}
$(document).ready( function() {
        CEPMODEMON.initializeCEPMODEMON(document.getElementById("paper-main-window"),document.getElementById("paper-minimap-window"));
    }
)

