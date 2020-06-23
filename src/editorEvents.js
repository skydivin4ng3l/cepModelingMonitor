export const EditorEvents = new Object();
EditorEvents.init = function (paper, info) {

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
    ///zooming
    paper.on({
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
    })
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

    /*// var verticesTool = new joint.linkTools.Vertices();
    // var segmentsTool = new joint.linkTools.Segments();
    var sourceArrowheadTool = new joint.linkTools.SourceArrowhead();
    var targetArrowheadTool = new joint.linkTools.TargetArrowhead();
    // var sourceAnchorTool = new joint.linkTools.SourceAnchor();
    // var targetAnchorTool = new joint.linkTools.TargetAnchor();
    // var boundaryTool = new joint.linkTools.Boundary();
    var removeButton = new joint.linkTools.Remove();

    var toolsView = new joint.dia.ToolsView({
        tools: [

            sourceArrowheadTool, targetArrowheadTool,

             removeButton
        ]
    });

    paper.on('link:mouseenter', function (linkView) {
        linkView.addTools(toolsView);
    });

    paper.on('link:mouseleave', function (linkView) {
        linkView.removeTools();
    });*/



    // Attribute Event

    paper.on('myclick:circle', function(linkView, evt) {
        evt.stopPropagation();
        var link = linkView.model;
        var t = (link.attr('c1/atConnectionRatio') > .2) ? .2 :.9; //this is the goal/targer
        var transitionOpt = {
            delay: 100,
            duration: 2000,
            timingFunction: joint.util.timing.inout
        };
        link.transition('attrs/c1/atConnectionRatio', t, transitionOpt);
        link.transition('attrs/c2/atConnectionRatio', t, transitionOpt);
    });

    paper.on('myclick:rect', function(linkView,evt) {
       evt.stopPropagation();
       var link = linkView.model;
       var label = link.attr('signText/text');
       console.log(label);
       link.attr('signText/text','buuuh');
    });

    paper.on('monitor:change:source', function(linkView, evt) {
        evt.stopPropagation();
        console.log('i got called');
        var link = linkView.model;
        var label = link.attr('streamLabel/text');
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
        })
        //get the index dynamically
        link.transition('labels/1/position/distance',1, {
            delay: 100,
            duration: 500,
            valueFunction: joint.util.interpolate.number,
            timingFunction: joint.util.timing.linear
        });
        link.on('transition:end', function(link){
            link.removeLabel(1)
        })
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
            var id = link.attr('canvasContainer/id');
            console.log(id);
            link.attr('canvasContainer/id', 'newUniqueID');
            var canvas = $('#newUniqueID').append('<canvas id="myCanvas" width="400" height="400" style="position: absolute;z-index:100;width:400px;height:400px;"></canvas> ');
            var ctx = $('#myCanvas')[0].getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets: [{
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
            $('#streamInputOk').off('click.streamNameOk');
            $('#streamInput').remove();
        })
    });

    paper.on('element:button:pointerdown', function(elementView, evt) {
        evt.stopPropagation(); // stop any further actions with the element view (e.g. dragging)

        var model = elementView.model;

        if (model.attr('body/visibility') === 'visible') {
            model.attr('body/visibility', 'hidden');
            model.attr('label/visibility', 'hidden');
            model.attr('buttonLabel/text', '＋'); // fullwidth plus

        } else {
            model.attr('body/visibility', 'visible');
            model.attr('label/visibility', 'visible');
            model.attr('buttonLabel/text', '＿'); // fullwidth underscore
        }
    });
}