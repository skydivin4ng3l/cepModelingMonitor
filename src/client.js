import {EditorEvents} from "./editorEvents.js";
import {CepElements} from "./cepElement.js";

export const CEPMODEMON = new Object();
/*CEPMODEMON.initNavBar = function() {
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
                CEPMODEMON.loadGraph(json);
            };
            readFile.readAsText(loadedFile);
        } else {
            console.warn("Failed to load file");
        }

        $('#fileInputContainer').remove();
    })
}
CEPMODEMON.loadGraph = function(json) {
    console.warn(json)
    CEPMODEMON.graph.fromJSON(json);

}
CEPMODEMON.navStartMonitoringButton = function(){
    console.log("Monitoring Start Button clicked");
}
CEPMODEMON.navStopMonitoringButton = function(){
    console.log("Monitoring Stop Button clicked");
}*/

CEPMODEMON.initializeCEPMODEMON = function(editorMain, editorMini){
    // this.initNavBar();

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
            height: 600 /*window.innerHeight*0.23*/,
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
    let portOutA = JSON.parse(JSON.stringify(portOut1));
    portOutA.markup= '<rect width="16" height="16" y="-8" fill="#e68a00" />';
    portOutA.label.markup = '<text class="label-text" fill="#e68a00" font-size="12"/>'
    portOutA.attrs.text.text = 'A';
    let portOutB = JSON.parse(JSON.stringify(portOut1));
    portOutB.markup= '<rect width="16" height="16" y="-8" fill="#0073e6" />';
    portOutB.label.markup = '<text class="label-text" fill="#0073e6" font-size="12"/>'
    portOutB.attrs.text.text = 'B';

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
    let portInA = JSON.parse(JSON.stringify(portIn1));
    // portInA.markup= '<circle r="10" fill="blue" stroke="green" cx="-10" />';
    portInA.label.markup = '<text class="label-text" fill="#e68a00" font-size="12"/>'
    portInA.attrs.text.text = 'A';
    let portInB = JSON.parse(JSON.stringify(portIn1));
    // portInB.markup= '<circle r="10" fill="blue" stroke="green" cx="-10" />';
    portInB.label.markup = '<text class="label-text" fill="#0073e6" font-size="12"/>'
    portInB.attrs.text.text = 'B';

    var epa_source = new joint.shapes.cep.Element({
        position: {
            x: 10,
            y: 10,
        },
        minimalSize: {
            width: 100,
            height: 130,
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
            x: 160,
            y: 10,
        },
        minimalSize: {
            width: 100,
            height: 130,
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
            x: 290,
            y: 10,
        },
        minimalSize: {
            width: 120,
            height: 125,
        },
        size: {
            width: 120,
            height: 125,
        },
        template: [
            '<div class="epa-element" >',
            '<h4 style="background: #f1553b"> Filter </h4>',
            '<form>',
            '<label for="filterName">FilterName:</label>',
            '<input type="text" name="filterName"><br>',
            '<label for="filterFunction">FilterFunction:</label>',
            '<textarea name="filterFunction" rows="3" placeholder="event.count>50"></textarea>',
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
        minimalSize: {
            width: 120,
            height: 160,
        },
        size: {
            width: 120,
            height: 160,
        },
        template: [
            '<div class="epa-element" >',
            '<h4 style="background: #3498DB"> Translate </h4>',
            '<form>',
            '<label for="translateName">TranslateName:</label>',
            '<input type="text" name="translateName"><br>',
            '<label for="outputEventType">OutputEventType:</label>',
            '<input type="text" name="outputEventType"><br>',
            //'<label for="referenceName">ReferenceName:</label>',
            //'<input type="text" name="referenceName"><br>',
            '<label for="derivationFunction">DerivationFunction:</label>',
            '<textarea name="derivationFunction" rows="3" placeholder="Out.temperatureF := event.temperatureC * 9/5 + 32"></textarea>',
            '</form>',
            '</div>'
        ].join(''),
    });
    epa_translate.addPorts([portIn1,portOut1]);

    var epa_enrich = new joint.shapes.cep.Element({
        position: {
            x: 620,
            y: 10,
        },
        minimalSize: {
            width: 120,
            height: 265,
        },
        size: {
            width: 120,
            height: 265,
        },
        template: [
            '<div class="epa-element" >',
            '<h4 style="background: #73b3de"> Enrich </h4>',
            '<form>',
            '<label for="enrichName">EnrichName:</label>',
            '<input type="text" name="enrichName"><br>',
            // '<label for="outputEventType">OutputEventType:</label>',
            // '<input type="text" name="outputEventType"><br>',
            '<label for="enrichMode">Mode:</label>',
            '<select name="enrichMode">',
            '<option>append</option>',
            '<option>replace</option>',
            '</select><br>',
            '<label for="derivationFunction">DerivationFunction:</label>',
            '<textarea name="derivationFunction" rows="3" placeholder="Out.temperatureF := Ref.temperatureC * 9/5 + 32"></textarea>',
            '<label for="referenceName">ReferenceName:</label>',
            '<input type="text" name="referenceName" placeholder="TrainData"><br>',
            '<label for="refQueryFunction">RefQueryFunction:</label>',
            '<textarea name="refQueryFunction" rows="3" placeholder="TrainData.find(and(eq(trainSectionId,event.TrainSection),eq(endStationId,event.EndStationId),eq(plannedArrivalTimeEndStation,event.PlannedArrivalTimeEndStation))).sort(ascending(plannedEventTime))"></textarea>',
            '</form>',
            '</div>'
        ].join(''),
    });
    epa_enrich.addPorts([portIn1,portOut1]);

    let contextTemplate = [
        '<label for="contextDimension">ContextDimension:</label>',
        '<select name="contextDimension">',
        '<option>Temporal</option>',
        '</select><br>',
        '<label for="contextType">ContextType:</label>',
        '<select name="contextType">',
        '<option>Fixed Interval</option>',
        '<option>Event Interval</option>',
        '<option>Sliding Fixed Interval</option>',
        '<option>Sliding Event Interval</option>',
        '</select><br>',
        '<label for="contextFunction">ContextFunction:</label>',
        '<input type="text" name="contextFunction" placeholder="t+kr<=o(e)<t+kr+d"><br>',
    ].join('')

    var epa_pattern = new joint.shapes.cep.Element({
        position: {
            x: 785,
            y: 10,
        },
        minimalSize: {
            width: 120,
            height: 335,
        },
        size: {
            width: 120,
            height: 335,
        },
        template: [
            '<div class="epa-element" >',
            '<h4 style="background: #ab60bb"> Pattern </h4>',
            '<form>',
            '<label for="patternName">PatternName:</label>',
            '<input type="text" name="patternName"><br>',
            contextTemplate,
            '<label for="inputAEventType">InputAEventType:</label>',
            '<input type="text" name="inputAEventType"><br>',
            '<label for="inputBEventType">InputBEventType:</label>',
            '<input type="text" name="inputBEventType"><br>',
            '<label for="outputEventType">OutputEventType:</label>',
            '<input type="text" name="outputEventType"><br>',
            '<label for="patternFunction">PatternFunction:</label>',
            '<textarea name="patternFunction" rows="3" placeholder="(A.count>50).followedBy(B.price<20)"></textarea>',
            '</form>',
            '</div>'
        ].join(''),
    });

    epa_pattern.addPorts([portInA,portInB,portOut1])

    var epa_aggregate = new joint.shapes.cep.Element({
        position: {
            x: 960,
            y: 10,
        },
        minimalSize: {
            width: 120,
            height: 340,
        },
        size: {
            width: 130,
            height: 340,
        },
        template: [
            '<div class="epa-element" >',
            '<h4 style="background: #0c926e"> Aggregate </h4>',
            '<form>',
            '<label for="aggregateName">AggregateName:</label>',
            '<input type="text" name="aggregateName"><br>',
            '<label for="aggregateType">AggregateFunction:</label>',
            '<select name="aggregateType">',
            '<option>Sum</option>',
            '<option>Maximum</option>',
            '<option>Minimum</option>',
            '<option>Average</option>',
            '<option>Custom</option>',
            '</select><br>',
            '<label for="aggregateAttributes">AggregationAttributes:</label>',
            '<input type="text" name="aggregateAttributes"><br>',
            '<label for="customAggregateFunction">CustomFunction:</label>',
            '<textarea name="customAggregateFunction" rows="3" ></textarea>',
            '<label for="outputEventType">OutputEventType:</label>',
            '<input type="text" name="outputEventType"><br>',
            contextTemplate,
            '</form>',
            '</div>'
        ].join(''),
    });

    epa_aggregate.addPorts([portIn1,portOut1])

    var epa_split = new joint.shapes.cep.Element({
        position: {
            x: 1140,
            y: 10,
        },
        minimalSize: {
            width: 120,
            height: 255,
        },
        size: {
            width: 120,
            height: 255,
        },
        template: [
            '<div class="epa-element" >',
            '<h4 style="background: #e8cce8"> Split </h4>',
            '<form>',
            '<label for="splitName" class="A">SplitName:</label>',
            '<input type="text" name="splitName"><br>',
            '<div class="section-a">',
            '<div class="inline-field">',
            '<label for="projectA" >ProjectOutputA:</label>',
            '<input type="checkbox" name="projectA"><br>',
            '</div>',
            '<label for="projectAMode" class="A">ProjectionModeA:</label>',
            '<select name="projectAMode">',
            '<option>keep</option>',
            '<option>omit</option>',
            '</select><br>',
            '<label for="projectAAttr" class="A">ProjectionAttrA:</label>',
            '<input type="text" name="projectAAttr"><br>',
            '</div>',
            '<div class="section-b">',
            '<div class="inline-field">',
            '<label for="projectB" class="checkbox-inline">ProjectOutputB:',
            '<input type="checkbox" name="projectB"></label><br>',
            '</div>',
            '<label for="projectBMode" class="B">ProjectionModeB:</label>',
            '<select name="projectBMode">',
            '<option>keep</option>',
            '<option>omit</option>',
            '</select><br>',
            '<label for="projectBAttr" class="B">ProjectionAttrB:</label>',
            '<input type="text" name="projectBAttr"><br>',
            '</div>',
            '</form>',
            '</div>'
        ].join(''),
    });
    epa_split.addPorts([portIn1,portOutA,portOutB]);

    var epa_compose = new joint.shapes.cep.Element({
        position: {
            x: 1310,
            y: 10,
        },
        minimalSize: {
            width: 120,
            height: 425,
        },
        size: {
            width: 120,
            height: 425,
        },
        template: [
            '<div class="epa-element" >',
            '<h4 style="background: #d7e726"> Compose </h4>',
            '<form>',
            '<label for="composeName" class="A">ComposeName:</label>',
            '<input type="text" name="composeName"><br>',
            contextTemplate,
            '<label for="composeFunction">JoinFunction:</label>',
            '<textarea name="composeFunction" rows="3" placeholder="A.Country=B.Destination"></textarea>',
            '<div class="section-a">',
            '<div class="inline-field">',
            '<label for="projectA" >ProjectInputA:</label>',
            '<input type="checkbox" name="projectA"><br>',
            '</div>',
            '<label for="projectAMode" class="A">ProjectionModeA:</label>',
            '<select name="projectAMode">',
            '<option>keep</option>',
            '<option>omit</option>',
            '</select><br>',
            '<label for="projectAAttr" class="A">ProjectionAttrA:</label>',
            '<input type="text" name="projectAAttr"><br>',
            '</div>',
            '<div class="section-b">',
            '<div class="inline-field">',
            '<label for="projectB" class="checkbox-inline">ProjectInputB:',
            '<input type="checkbox" name="projectB"></label><br>',
            '</div>',
            '<label for="projectBMode" class="B">ProjectionModeB:</label>',
            '<select name="projectBMode">',
            '<option>keep</option>',
            '<option>omit</option>',
            '</select><br>',
            '<label for="projectBAttr" class="B">ProjectionAttrB:</label>',
            '<input type="text" name="projectBAttr"><br>',
            '</div>',
            '</form>',
            '</div>'
        ].join(''),
    });
    epa_compose.addPorts([portInA,portInB,portOut1]);

    var epa_project = new joint.shapes.cep.Element({
        position: {
            x: 1470,
            y: 10,
        },
        minimalSize: {
            width: 120,
            height: 130,
        },
        size: {
            width: 120,
            height: 130,
        },
        template: [
            '<div class="epa-element" >',
            '<h4 style="background: #22adc6"> Project </h4>',
            '<form>',
            '<label for="projectName" >ProjectName:</label>',
            '<input type="text" name="projectName"><br>',
            '<label for="projectMode" >ProjectionMode:</label>',
            '<select name="projectMode">',
            '<option>keep</option>',
            '<option>omit</option>',
            '</select><br>',
            '<label for="projectAttr" class="A">ProjectionAttr:</label>',
            '<input type="text" name="projectAttr"><br>',
            '</form>',
            '</div>'
        ].join(''),
    });
    epa_project.addPorts([portIn1,portOut1]);

    let epa_generic = new joint.shapes.cep.Element({
        position: {
            x: 1620,
            y: 10,
        },
        minimalSize: {
            width: 120,
            height: 290,
        },
        size: {
            width: 120,
            height: 290,
        },
    });
    epa_generic.addPorts([portIn1,portOut1]);

    editorElementToolBarGraph.addCells([epa_source, epa_sink, epa_filter, epa_translate,epa_pattern, epa_enrich, epa_aggregate, epa_split, epa_compose, epa_project, epa_generic ]);

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

        $('body').on('mousemove.fly', function(evt) {
            $("#flyPaper").offset({
                left: evt.pageX - offset.x,
                top: evt.pageY - offset.y
            });
        });
        $('body').on('mouseup.fly', function(evt) {
            var x = evt.pageX,
                y = evt.pageY,
                target = paper.$el.offset();

            // Dropped over paper ?
            if (x > target.left && x < target.left + paper.$el.width() && y > target.top && y < target.top + paper.$el.height()) {
                var shape = flyShape.clone();
                shape.position(x - target.left - offset.x, y - target.top - offset.y);
                let shapeSize = shape.get('size');
                shape.resize(shapeSize.width*2,shapeSize.height);
                CEPMODEMON.graph.addCell(shape);
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

    EditorEvents.init(paper, info, CEPMODEMON);

}
$(document).ready( function() {
        CEPMODEMON.initializeCEPMODEMON(document.getElementById("paper-main-window"),document.getElementById("paper-minimap-window"));
    }
)

