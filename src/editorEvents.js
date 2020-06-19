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

}