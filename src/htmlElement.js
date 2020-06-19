export const CUSTOMELEMENTS = new Object()
CUSTOMELEMENTS.init = function() {

    joint.shapes.cep = {};
    joint.shapes.cep.Link =joint.dia.Link.define('cep.Link',{
        attrs: {
            line: {
                targetMarker: {
                    'type': 'path',
                    'stroke': 'black',
                    'd': 'M 10 -5 0 0 10 5 z'
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
    })


    joint.shapes.cep.Element = joint.shapes.basic.Rect.define(
        'cep.Element',
        {
            attrs: {
                rect: {
                    stroke: 'green',
                    refWidth: '100%',
                    refHeight: '100%',
                    fillOpacity: '0',
                },
                '.content': {
                    text: '',
                    'ref-x': .5,
                    'ref-y': .5,
                    'y-alignment': 'middle',
                    'x-alignment': 'middle'
                }
            }
        },{
            markup: [{
                tagName: 'g',
                className: 'rotatable',
                children: [{
                   tagName: 'g',
                   className: 'scalable',
                   children: [{
                       tagName: 'rect',
                       selector: 'rect',
                   },{
                       tagName: 'foreignObject',
                       className: 'fobj',
                       children: [{
                           tagName: 'body',
                           namespaceURI: 'http://www.w3.org/1999/xhtml',
                           children: [{
                               tagName: 'div',
                               className: 'content',
                               selector: 'content',
                               children: [{
                                   tagName: 'input',
                                   attributes: {
                                       type: 'text',
                                       value: 'Heyhooooo'
                                   }
                               }]

                           }]
                       }]

                   }]
                }],

            },
            ]
        }
    )


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
            '<div class="html-element">',
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
