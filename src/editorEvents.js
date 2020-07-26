import {MonitorSubscriptionManager} from './monitorSubscriptionManager.js';

export const EditorEvents = new Object();
EditorEvents.CEPMODEMON = new Object();
EditorEvents.paper = new Object();
EditorEvents.initNavBar = function() {
    let navBar = $('#navBar');
    navBar.append([
        '<button type="button" id="saveButton" class="saveButton" >Save</button>',
        '<button type="button" id="loadButton" class="loadButton" >Load</button>',
        '<button type="button" id="monitorStartButton"  class="monitorStartButton" > Start Monitoring</button>',
        '<button type="button" id="monitorStopButton" class="monitorStopButton" > Stop Monitoring</button>',
        '<button type="button" id="zoomInButton" class="zoomInButton" > Zoom In</button>',
        '<button type="button" id="zoomOutButton" class="zoomOutButton" > Zoom Out</button>',
    ].join(''))
    $('#saveButton').bind('click', EditorEvents.navSaveButton);
    $('#loadButton').bind('click', EditorEvents.navLoadButton);
    $('#monitorStartButton').bind('click', EditorEvents.navStartMonitoringButton);
    $('#monitorStopButton').bind('click', EditorEvents.navStopMonitoringButton);
    $('#zoomInButton').bind('click', EditorEvents.navZoomInButton);
    $('#zoomOutButton').bind('click', EditorEvents.navZoomOutButton);
}
EditorEvents.saveToFile= function(content, fileName, contentType){
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href)
}
EditorEvents.navSaveButton = function(){
    console.log("Save Button clicked");
    let graphJsonObject = EditorEvents.CEPMODEMON.graph.toJSON();
    EditorEvents.saveToFile(JSON.stringify(graphJsonObject),'graph.json','application/json');
}
EditorEvents.navLoadButton = function(){
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
                EditorEvents.loadGraph(json);
            };
            readFile.readAsText(loadedFile);
        } else {
            console.warn("Failed to load file");
        }

        $('#fileInputContainer').remove();
    })
}
EditorEvents.loadGraph = function(json) {
    console.warn(json)
    EditorEvents.CEPMODEMON.graph.fromJSON(json);
    let links = EditorEvents.CEPMODEMON.graph.getLinks();
    MonitorSubscriptionManager.resetRegistry();
    for(let link of links) {
        if (!link.attr('streamLabel/text').includes(' ')){
            MonitorSubscriptionManager.registerConsumer(link);
        }
        // Remove potenially saved Eventmarkers (labels)
        link.set('labels',[]);
    }
}
EditorEvents.navStartMonitoringButton = function(){
    console.log("Monitoring Start Button clicked");
    MonitorSubscriptionManager.startMonitoring();
}
EditorEvents.navStopMonitoringButton = function(){
    console.log("Monitoring Stop Button clicked");
    MonitorSubscriptionManager.stopListeners();
}
EditorEvents.navZoomInButton = function(){
    //zoom in
    let currentScale = EditorEvents.paper.scale().sx;
    if (currentScale >= 2) { return }
    let newScale = currentScale +0.1;
    EditorEvents.paper.scale(newScale,newScale )
}
EditorEvents.navZoomOutButton = function(){
    //zoom out
    let currentScale = EditorEvents.paper.scale().sx;
    if (currentScale <= 0.2) { return }
    let newScale = currentScale -0.1;
    EditorEvents.paper.scale(newScale,newScale )
}


EditorEvents.init = function (paper, info, CEPMODEMON) {
    EditorEvents.CEPMODEMON = CEPMODEMON;
    EditorEvents.initNavBar();
    EditorEvents.paper = paper;
    //MonitorSubscriptionManager.startListeners();



    // Highlighting
    paper.on('blank:mouseover', function() {
        resetAll(this);

        info.attr('body/visibility', 'hidden');
        info.attr('label/visibility', 'hidden');

        // this.drawBackground({
        //     color: 'orange'
        // })
    });

    paper.on('element:mouseover', function(elementView) {
        resetAll(this);

        var currentElement = elementView.model;
        currentElement.attr('body/stroke', 'orange')
    });

    paper.on('link:mouseover', function(linkView) {
        resetAll(this);

        var currentLink = linkView.model;
        currentLink.attr('line/stroke', 'orange');
        currentLink.label(0, {
            attrs: {
                body: {
                    stroke: 'orange'
                }
            }
        });
    });

    paper.on('cell:mouseover', function(cellView) {
        var isElement = cellView.model.isElement();
        var message = 'This is a '+ (isElement ? 'Element' : 'Link');
        info.attr('label/text', message);

        info.attr('body/visibility', 'visible');
        info.attr('label/visibility', 'visible');
    });

    function resetAll(paper) {
        paper.drawBackground({
            color: 'white'
        })

        var elements = paper.model.getElements();
        for (var i = 0, ii = elements.length; i < ii; i++) {
            var currentElement = elements[i];
            currentElement.attr('body/stroke', 'black');
        }

        var links = paper.model.getLinks();
        for (var j = 0, jj = links.length; j < jj; j++) {
            var currentLink = links[j];
            currentLink.attr('line/stroke', 'black');
            currentLink.label(0, {
                attrs: {
                    body: {
                        stroke: 'black'
                    }
                }
            })
        }
    }

    ///Mouse zooming
    /*paper.on({
        'blank:mousewheel': function(evt,x,y,delta) {
            console.log(delta);

            if (delta>0){
                //zoom in
                let currentScale = this.scale().sx;
                if (currentScale >= 2) { return }
                let newScale = currentScale +0.1;
                this.scale(newScale,newScale )
            } else {
                //zoom out
                let currentScale = this.scale().sx;
                if (currentScale <= 0.2) { return }
                let newScale = currentScale -0.1;
                this.scale(newScale,newScale )
            }
        }
    })*/

    // //panning
    // paper.on({
    //     'blank:pointerdown': function(evt, x, y) {
    //         console.log('dragstart',x,y)
    //         let currentScale = this.scale().sx;
    //         evt.data = { pan: {x: x * currentScale, y: y * currentScale} };
    //     },
    //     'blank:pointermove': function(evt, x, y) {
    //         console.log('dragcontinue',x,y, evt)
    //         let startDrag = evt.data.pan
    //         let current = this.translate()
    //         console.log('current',current.tx,current.ty, evt)
    //         this.translate(startDrag.x - x , startDrag.y - y  )
    //     },
    //     'blank:pointerup': function(evt) {
    //
    //     }
    // });

    //Hotkeys
    $(document).on('keydown', function f(event) {
        // console.log(event)
    })
    $(document).on('keypress', function f(event) {
        // console.log(event)
    })
    $(document).on('keyup', function f(event) {
        // console.log(event)
    })

    // Create a new link by dragging
    // paper.on({
    //     'blank:pointerdown': function(evt, x, y) {
    //         var link = new joint.dia.Link();
    //         link.set('source', { x: x, y: y });
    //         link.set('target', { x: x, y: y });
    //         link.addTo(this.model);
    //         evt.data = { link: link, x: x, y: y };
    //     },
    //     'blank:pointermove': function(evt, x, y) {
    //         evt.data.link.set('target', { x: x, y: y });
    //     },
    //     'blank:pointerup': function(evt) {
    //         var target = evt.data.link.get('target');
    //         if (evt.data.x === target.x && evt.data.y === target.y) {
    //             // remove zero-length links
    //             evt.data.link.remove();
    //         }
    //     }
    // });

    ///////Link Events
    paper.on({
        'link:source:click': function(linkView) {
            linkView.model.attr({
                sourceReferenceBody: { fill: 'white' },
                targetReferenceBody: { fill: '#fe854f' }
            });
        },
        'link:target:click': function(linkView) {
            linkView.model.attr({
                sourceReferenceBody: { fill: '#fe854f' },
                targetReferenceBody: { fill: 'white' }
            });
        }
    });


    // Link Attribute Event
    paper.on('monitor:change:source', function(linkView, evt) {
        evt.stopPropagation();
        console.log('i got called');
        var link = linkView.model;
        var label = link.attr('streamLabel/text');

        //To the page
        $('#container').append(
            '<div class="streamInput" id="streamInput" style="position:absolute;z-index:100;width:500px;top:50%;left:50%;margin:0 auto 0 -250px;">' +
            '<form class="streamInputForm" style="position: absolute">' +
            '<input class="streamInputName" id="streamInputName" type="text" autofocus value="' + label + '" style="width: 100%">' +
            '<input class="streamInputOk" id="streamInputOk" type="button" value="Ok" style="width: 100%">' +
            '</form>' +
            '</div>');
        console.log(label);
        $('#streamInputOk').on('click.streamNameOk', function() {
            var newLabel = $('#streamInputName').val();
            console.log(newLabel);
            link.attr('streamLabel/text', newLabel);
            MonitorSubscriptionManager.registerConsumer(link);

            $('#streamInputOk').off('click.streamNameOk');
            $('#streamInput').remove();
        })
    });

    paper.on('monitor:remove:source', function (linkView, evt) {
        evt.stopPropagation();
        console.log('link remove button pressed')
        linkView.model.remove();
        //TODO remove listener etc
    })

    paper.on('cepElement:remove', function (elementView, evt) {
        evt.stopPropagation();
        console.log('element remove button pressed')
        elementView.model.remove();
        //TODO remove listener etc
    })

    paper.on('cepElement:resize', function (elementView, evt) {
        evt.stopPropagation();
        console.log('element resize button pressed')
        let currentSize = elementView.model.get('size');
        let minimalSize = elementView.model.get('minimalSize');
        if(currentSize.width !== minimalSize.width) {
            elementView.model.resize(minimalSize.width,minimalSize.height);
        } else {
            elementView.model.resize(minimalSize.width*2,minimalSize.height);
        }

        //TODO remove listener etc
    })

    //WIP Minification of EPAs
    paper.on('element:button:pointerdown', function(elementView, evt) {
        evt.stopPropagation(); // stop any further actions with the element view (e.g. dragging)

        var model = elementView.model;

        //Open Delete Menu
        if(model.menu === 'visible') {
            model.attr('removeLabel/visibility', 'hidden');
            model.attr('removeButton/visibility', 'hidden');
            model.attr('resizeLabel/visibility', 'hidden');
            model.attr('resizeButton/visibility', 'hidden');
            model.attr('buttonLabel/text', '＋'); // fullwidth plus
            model.menu = 'hidden';
        } else {
            model.attr('removeLabel/visibility', 'visible');
            model.attr('removeButton/visibility', 'visible');
            model.attr('resizeLabel/visibility', 'visible');
            model.attr('resizeButton/visibility', 'visible');
            model.attr('buttonLabel/text', '－'); // fullwidth minus
            model.menu = 'visible';
        }

        //Foldin the EPA
        if (model.menu === 'visible') {
            //model.attr('buttonLabel/text', '－'); // fullwidth minus
            // model.attr('body/visibility', 'hidden');
            // model.attr('label/visibility', 'hidden');

        } else {
            // model.attr('body/visibility', 'visible');
            // model.attr('label/visibility', 'visible');
            model.attr('buttonLabel/text', '＋'); // fullwidth plus
        }
    });
}