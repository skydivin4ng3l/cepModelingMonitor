// import { Element } from 'jointjs/src/dia/Element'

export const CepElements = new Object()
CepElements.init = function() {

    joint.shapes.cep = {};
    joint.shapes.cep.Link = joint.dia.Link.define(
        'cep.Link',
        {
            attrs: {
                line: {
                    connection: true,
                    stroke: '#333333',
                    strokeWidth: 2,
                    strokeLinejoin: 'round',
                    targetMarker: {
                        'type': 'path',
                        'd': 'M 10 -5 0 0 10 5 z'
                    }
                },
                wrapper: {
                    connection: true,
                    strokeWidth: 20,
                    strokeLinejoin: 'round'
                },
                streamLabel: {
                    fill: 'black',
                    fontSize: 12,
                    textAnchor: 'middle',
                    //textVerticalAnchor: 'middle',
                    // yAlignment: 'middle',
                    xAlignment: 'middle',
                    pointerEvents: 'none',
                    text: 'enter the stream name here',
                    atConnectionRatioIgnoreGradient: 0.5,
                    y: 40,
                },
                streamLabelBody: {
                    ref: 'streamLabel',
                    fill: 'white',
                    stroke: 'black',
                    strokeWidth: 2,
                    strokeDasharray: '5 5',
                    refWidth: '120%',
                    refHeight: '120%',
                    // height: 40,
                    // width: 200,
                    // yAlignment: 'middle',
                    xAlignment: 'middle',
                    y: 28,
                    event: 'monitor:change:source',
                    cursor: 'text',
                    atConnectionRatioIgnoreGradient: 0.5,
                },
                streamLabelConnector: {
                    atConnectionRatioIgnoreGradient: 0.5,
                    d: 'M 0 0 0 28',
                    stroke: 'black',
                    strokeDasharray: '5 5'
                },
                streamMonitorBody: {
                    // ref: 'streamLabelBody',
                    // refWidth: '100%',
                    // refHeight: '200%',
                    height: 60,
                    width: 200,
                    // stroke: '#333333',
                    fill: '#ffffff',
                    fillOpacity: 0.5,
                    xAlignment: 'middle',
                    strokeWidth: 2,
                    y: -60,
                    atConnectionRatioIgnoreGradient:0.5,
                },removeLabel: {
                    fill: '#fff',
                    text: 'X',
                    fontSize: 12,
                    /*textAnchor: 'middle',*/
                    xAlignment: 'middle',
                    yAlignment: 'middle',
                    atConnectionRatioIgnoreGradient:0.1,
                    cursor: 'pointer',
                    event: 'monitor:remove:source'
                },
                removeButton: {
                    ref: 'removeLabel',
                    refR: '90%',
                    refCx: '100%',
                    refCy: '100%',
                    xAlignment: 'middle',
                    yAlignment: 'middle',
                    fill: '#ff0000',
                    atConnectionRatioIgnoreGradient:0.1,
                },
                foreignObject: {
                    ref: 'streamMonitorBody',
                    refWidth: '100%',
                    refHeight: '100%',
                    xAlignment: 'middle',
                    y: -60,
                    atConnectionRatioIgnoreGradient:0.5,
                },
                canvasContainer: {
                    /*id: ,*/
                }
            }
        },{
            markup: [
                {
                    tagName: 'path',
                    selector: 'line',
                    attributes: {
                        'fill': 'none',
                        'pointer-events': 'none'
                    },
                    /*className: 'connection'*/
                }, {
                    tagName: 'path',
                    selector: 'wrapper',
                    attributes: {
                        'fill': 'none',
                        'cursor': 'pointer',
                        'stroke': 'transparent',
                        'stroke-linecap': 'round',
                    },
                    /*className: 'connection-wrap'*/
                },{
                    tagName: 'g',
                    className: 'link-tools'
                }, {
                    tagName: 'rect',
                    selector: 'streamLabelBody'
                }, {
                    tagName: 'text',
                    selector: 'streamLabel',
                },{
                    tagName: 'circle',
                    selector: 'removeButton'
                },{
                    tagName: 'text',
                    selector: 'removeLabel',
                },{
                    tagName: 'path',
                    selector: 'streamLabelConnector'
                },{
                    tagName:'rect',
                    selector: 'streamMonitorBody'
                },{
                    tagName: 'foreignObject',
                    selector: 'foreignObject',
                    attributes: {
                        'overflow': 'visible'
                    },
                    children: [
                        {
                            tagName: 'div',
                            namespaceURI: 'http://www.w3.org/1999/xhtml',
                            selector: 'canvasContainer',
                            style: {
                                width: '100%',
                                height: '100%',
                                position: 'static',
                                backgroundColor: 'transparent',
                                textAlign: 'center',
                                margin: 0,
                                padding: '0px 0px',
                                boxSizing: 'border-box',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            },
                            /*attributes: {
                                id: 'myFOContainer'
                            }*/
                        },
                    ]
                },

            ],

        }
    );

    joint.shapes.cep.LinkView = joint.dia.LinkView;

    const foLabelMarkup = {
        tagName: 'foreignObject',
        selector: 'foreignObject',
        attributes: {
            'overflow': 'visible'
        },
        children: [{
            tagName: 'div',
            namespaceURI: 'http://www.w3.org/1999/xhtml',
            selector: 'htmlContainer',
            style: {
                width: '100%',
                height: '100%',
                position: 'relative'/*'static'*/,
                backgroundColor: 'transparent',
                // textAlign: 'center',
                margin: 0,
                // padding: '0px 5px',
                boxSizing: 'border-box',
                // display: 'flex',
                // alignItems: 'center',
                // justifyContent: 'center'
            },
        }]
    };

    joint.shapes.cep.Element = joint.dia.Element.define(
        'cep.Element',
        {
            attrs: {
                body: {
                    refWidth: '100%',
                    refHeight: '100%',
                    stroke: '#333333',
                    fill: '#ffffff',
                    strokeWidth: 2,
                    visibility: 'visible',
                },
                foreignObject: {
                    refWidth: '100%',
                    refHeight: '100%'
                },
                htmlContainer: {
                    id: 'htmlContainer',
                    style: {
                        fontSize: 14
                    }
                },
                '.':{magnet:false},
                button: {
                    cursor: 'pointer',
                    ref: 'buttonLabel',
                    refWidth: '150%',
                    refHeight: '150%',
                    refX: '-25%',
                    refY: '-25%',
                    event: 'element:button:pointerdown',
                    fill: 'orange',
                    stroke: 'black',
                    strokeWidth: 2
                },
                buttonLabel: {
                    pointerEvents: 'none',
                    ref: 'body',
                    refX: '-50%',
                    refY: '-50%',
                    textAnchor: 'middle',
                    textVerticalAnchor: 'middle',
                    text: '＿', // fullwidth underscore
                    fill: 'black',
                    fontSize: 8,
                    fontWeight: 'bold'
                },removeLabel: {
                    pointerEvents: 'none',
                    ref: 'body',
                    refX: '50%',
                    refY: '-50%',
                    refX2: 5,
                    refY2: -5,
                    fill: '#fff',
                    text: 'X',
                    fontSize: 12,
                    visibility: 'hidden',
                    /*textAnchor: 'middle',*/
                    // xAlignment: 'middle',
                    // yAlignment: 'middle',
                },
                removeButton: {
                    cursor: 'pointer',
                    event: 'cepElement:remove',
                    ref: 'removeLabel',
                    refR: '90%',
                    refX: '50%',
                    // refCx: '100%',
                    // refCy: '100%',
                    refY: '50%',
                    xAlignment: 'middle',
                    yAlignment: 'middle',
                    fill: '#ff0000',
                    visibility: 'hidden',
                },
            },
            ports: {
                groups: {
                    out:{
                        position: {
                            name: 'right'
                        },
                        attrs: {
                            '.port-label': {
                                fill: '#000',
                            },
                            rect: {
                                /*fill: 'red',*/
                                stroke: '#000',
                                magnet: true,
                            }
                        },
                        label: {
                            position: {
                                name: 'bottom',
                                args: {x: 15 } // extra arguments for the label layout function, see `layout.PortLabel` section
                            },
                        },
                    },
                    in: {
                        position: {
                            name: 'left',
                        },
                        attrs: {
                            '.port-label': {
                                fill: '#000'
                            },
                            circle: {
                                fill: '#fff',
                                stroke: '#000',
                                r: 10,
                                cx: -10,
                                magnet: 'passive',
                            }
                        },
                        label: {
                            position: {
                                name: 'bottom',
                                args: {x: -15} // extra arguments for the label layout function, see `layout.PortLabel` section
                            },
                        },
                    }
                }
            },
            template: [
                '<div class="epa-element" >',
                '<h4 style="background: darkorange"> Generic EPA </h4>',
                '<form>',
                '<label for="epaName">EPAName:</label>',
                '<input type="text" id="epaName" name="epaName"><br>',
                '<label for="genericEpaFunction">GenericEPAFunction:</label>',
                '<textarea name="genericEpaFunction" rows="5" placeholder="someNotes"></textarea>',
                '<label for="referenceName">ReferenceName:</label>',
                '<input type="text" name="referenceName" placeholder="PlannedTrainData"><br>',
                '<label for="refQueryFunction">RefQueryFunction:</label>',
                '<textarea name="refQueryFunction" rows="5" placeholder="Query"></textarea>',
                '</form>',
                '</div>'
            ].join(''),
        },{
            markup: [{
                tagName: 'rect',
                selector: 'body'
            }, {
                tagName: 'rect',
                selector: 'button'
            }, {
                tagName: 'text',
                selector: 'buttonLabel'
            }, {
                tagName: 'circle',
                selector: 'removeButton'
            }, {
                tagName: 'text',
                selector: 'removeLabel',
            }, foLabelMarkup ],

            initialize: function() {
                joint.dia.Element.prototype.initialize.apply(this, arguments);
                console.log(this);
                let htmlContainerId = joint.util.uuid();
                this.attr('htmlContainer/id', htmlContainerId);

            },
        }, {

            attributes: {
                text: {
                    set: function (text, refBBox, node, attrs) {
                        // if (node instanceof HTMLElement) {
                            node.textContent = text;

                        /*} else {
                            // No foreign object
                            var style = attrs.style || {};
                            var wrapValue = {text: text, width: -5, height: '100%'};
                            var wrapAttrs = joint.util.assign({textVerticalAnchor: 'middle'}, style);
                            attributes.textWrap.set.call(this, wrapValue, refBBox, node, wrapAttrs);
                            return {fill: style.color || null};
                        }*/
                    },
                    position: function (text, refBBox, node) {
                        // No foreign object
                        if (node instanceof SVGElement) return refBBox.center();
                    }
                }
            }
        }
    )

    joint.shapes.cep.ElementView = joint.dia.ElementView.extend({
        initialize: function () {
            joint.dia.ElementView.prototype.initialize.apply(this,arguments);
            console.log('elementView Initialize got called');
            this.$template = $(_.template(this.model.get('template'))());
            this.$template.find('input,select,textarea').on('mousedown click', function(evt) {
                evt.stopPropagation();
            });
            // This is an example of reacting on the input change and storing the input data in the cell model.
            this.$template.find('input,select,textarea').on('change', _.bind(function(evt) {
                this.model.set($(evt.target).attr('name')/*'input'*/, $(evt.target).val());
            }, this));
            // this.$template.find('select').on('change', _.bind(function(evt) {
            //     this.model.set($(evt.target).attr('name'), $(evt.target).val());
            // }, this));
            let model = this.model;
            this.$template.find('input,select').each(function(){
                let currentElementName = $(this).attr('name');
                let modelValueForName = model.get(currentElementName)
                if (typeof modelValueForName !== 'undefined' ) {
                    $(this).val(modelValueForName)
                }
            })
        },
        render: function () {
            joint.dia.ElementView.prototype.render.apply(this,arguments);
            console.log('elementView render got called');
            let model = this.model
            let htmlContainerId = model.attr('htmlContainer/id');
            let htmlContainerElement = $('#'+ htmlContainerId);
            htmlContainerElement.append(this.$template/*model.get('template')*/);
            /*htmlContainerElement.find('input,select').on('mousedown click', function(evt) {
                evt.stopPropagation();
            });*/
            return this
        }
    })
    // Create a custom element.
    // ------------------------

    joint.shapes.html = {};
    joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
        //fills the not set default values
        defaults: joint.util.defaultsDeep({
            type: 'html.Element',
            attrs: {
                rect: { stroke: 'none', 'fill-opacity': 50 }
            }
        }, joint.shapes.basic.Rect.prototype.defaults)
    });

    // Create a custom view for that element that displays an HTML div above it.
    // -------------------------------------------------------------------------

    joint.shapes.html.ElementView = joint.dia.ElementView.extend({

        template: [
            '<div class="html-element" id="test">',
            '<button class="delete">x</button>',
            '<label></label>',
            '<span></span>', '<br/>',
            '<select><option>--</option><option>one</option><option>two</option></select>',
            '<input type="text" name="htmlInput" value="I\'m HTML input" />',
            '</div>'
        ].join(''),

        initialize: function() {
            _.bindAll(this, 'updateBox');
            joint.dia.ElementView.prototype.initialize.apply(this, arguments);

            this.$box = $(_.template(this.template)());
            // Prevent paper from handling pointerdown.
            this.$box.find('input,select').on('mousedown click', function(evt) {
                evt.stopPropagation();
            });
            // This is an example of reacting on the input change and storing the input data in the cell model.
            this.$box.find('input').on('change', _.bind(function(evt) {
                this.model.set($(evt.target).attr('name')/*'input'*/, $(evt.target).val());
            }, this));
            this.$box.find('select').on('change', _.bind(function(evt) {
                this.model.set('select', $(evt.target).val());
            }, this));
            this.$box.find('select').val(this.model.get('select'));
            this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
            // Update the box position whenever the underlying model changes.
            this.model.on('change', this.updateBox, this);
            // Remove the box when the model gets removed from the graph.
            this.model.on('remove', this.removeBox, this);

            this.updateBox();
        },
        render: function() {
            joint.dia.ElementView.prototype.render.apply(this, arguments);
            this.paper.$el.prepend(this.$box);

            this.updateBox();
            return this;
        },
        updateBox: function() {
            // Set the position and dimension of the box so that it covers the JointJS element.
            var bbox = this.model.getBBox();

            // var scale = this.paper.scale();
            // Example of updating the HTML with a data stored in the cell model.
            this.$box.find('label').text(this.model.get('label'));
            this.$box.find('span').text(this.model.get('select'));
            this.$box.css({
                width: bbox.width /*/ scale.sx*/,
                height: bbox.height /*/ scale.sy*/,
                left: bbox.x,
                top: bbox.y,
                transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)',
                // transform: 'scale(' +scale.sx + ',' + scale.sy + ')',
                // transformOrigin: '0 0',
            });
        },
        removeBox: function(evt) {
            this.$box.remove();
        }
    });

    // Create JointJS elements and add them to the graph as usual.
    // -----------------------------------------------------------

    var el1 = new joint.shapes.html.Element({
        position: { x: 80, y: 80 },
        size: { width: 170, height: 100 },
        label: 'I am HTML',
        select: 'one'
    });
    var el2 = new joint.shapes.html.Element({
        position: { x: 370, y: 160 },
        size: { width: 170, height: 100 },
        label: 'Me too',
        select: 'two'
    });
    var l = new joint.dia.Link({
        source: { id: el1.id },
        target: { id: el2.id },
        attrs: { '.connection': { 'stroke-width': 5, stroke: '#34495E' }}
    });

    // graph.addCells([el1, el2, l]);

};
