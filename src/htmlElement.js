// import { Element } from 'jointjs/src/dia/Element'

export const CUSTOMELEMENTS = new Object()
CUSTOMELEMENTS.init = function() {

    joint.shapes.cep = {};
    /*joint.shapes.cep.Link =joint.dia.Link.define('cep.Link',{
        attrs: {
            line: {
                targetMarker: {
                    'type': 'path',
                    'stroke': 'black',
                    'd': 'M 20 -10 0 0 20 10 Z'
                }
            }
        },
        defaultLabel: {
            markup: [
                {
                    tagName: 'rect',
                    selector: 'body'
                }, {
                    tagName: 'text',
                    selector: 'label'
                }
            ],
            attrs: {
                label: {
                    fill: 'black',
                    fontSize: 12,
                    textAnchor: 'middle',
                    textVerticalAnchor: 'middle',
                    yAlignment: 'middle',
                    pointerEvents: 'none',
                    text: 'buuuuh',

                },
                body: {
                    ref: 'label',
                    fill: 'white',
                    stroke: 'cornflowerblue',
                    strokeWidth: 2,
                    refWidth: '120%',
                    refHeight: '120%',
                    refX: '-10%',
                    refY: '-10%',
                    event: 'monitor:change:source',
                    cursor: 'text'
                }
            },
            position: {
                distance: 0.5,
                offset: 20,
            }
        }
    })*/

    var foLabelMarkup = {
        tagName: 'foreignObject',
        selector: 'foreignObject',
        attributes: {
            'overflow': 'hidden'
        },
        children: [{
            tagName: 'div',
            namespaceURI: 'http://www.w3.org/1999/xhtml',
            selector: 'htmlContainer',
            style: {
                width: '100%',
                height: '100%',
                position: 'static',
                backgroundColor: 'transparent',
                textAlign: 'center',
                margin: 0,
                padding: '0px 5px',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            },
            children: [{
                tagName: 'input',
                selector: 'textInput',
            },{
                tagName: 'select',
                selector: 'dropdown',
                children:[{
                    tagName: 'option',
                    selector: 'option1',
                },{
                    tagName: 'option',
                    selector: 'option2',
                }]
            }
            ]
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
                    strokeWidth: 2
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
                textInput: {
                    type: 'text',
                    value: 'someText',
                    ref: 'htmlContainer',
                    style: {
                        width: '100%'
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
                }
            },
            ports: {
                groups: {
                    a:{
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
                        }
                    }
                }
            }
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
            }, foLabelMarkup ],

            initialize: function() {
                joint.dia.Element.prototype.initialize.apply(this, arguments);
                console.log(this);
                let htmlContainerId = joint.util.uuid();
                this.attr('htmlContainer/id', htmlContainerId);
                let htmlContainerElement = $('#'+ htmlContainerId);
                htmlContainerElement.append([
                    '<div class="html-element" id="test">',
                    '<button class="delete">x</button>',
                    '<label></label>',
                    '<span></span>', '<br/>',
                    '<select><option>--</option><option>one</option><option>two</option></select>',
                    '<input type="text" value="I\'m HTML input" />',
                    '</div>'
                ].join(''));

                htmlContainerElement.find('input,select').on('mousedown click', function(evt) {
                    evt.stopPropagation();
                });
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
        },
        render: function () {
            joint.dia.ElementView.prototype.render.apply(this,arguments);
            console.log('elementView render got called');
            let model = this.model
            let htmlContainerId = model.attr('htmlContainer/id');
            let htmlContainerElement = $('#'+ htmlContainerId);
            htmlContainerElement.append([
                '<div class="html-element" id="test">',
                '<button class="delete">x</button>',
                '<label></label>',
                '<span></span>', '<br/>',
                '<select><option>--</option><option>one</option><option>two</option></select>',
                '<input type="text" value="I\'m HTML input" />',
                '</div>'
            ].join(''));
            htmlContainerElement.find('input,select').on('mousedown click', function(evt) {
                evt.stopPropagation();
            });
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
            '<input type="text" value="I\'m HTML input" />',
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
                this.model.set('input', $(evt.target).val());
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
