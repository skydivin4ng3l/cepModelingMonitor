export const CustomLink = joint.dia.Link.define('examples.CustomLink',{
    attrs: {
        line: {
            connection: true,
            fill: 'none',
            stroke: '#333333',
            strokeWidth: 2,
            strokeLinejoin: 'round',
            targetMarker: {
                'type': 'path',
                'd': 'M 10 -5 0 0 10 5 z' //implicit M move no drawing L lineTo
            }
        },
        relativeLabel: {
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fill: 'black',
            fontSize: 12
        },
        relativeLabelBody: {
            x: -15,
            y: -10,
            width: 30,
            height: 20,
            fill: 'white',
            stroke: 'black'
        },
        absoluteLabel: {
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fill: 'black',
            fontSize: 12
        },
        absoluteLabelBody: {
            x: -15,
            y: -10,
            width: 30,
            height: 20,
            fill: 'white',
            stroke: 'black'
        },
        absoluteReverseLabel: {
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fill: 'black',
            fontSize: 12
        },
        absoluteReverseLabelBody: {
            x: -15,
            y: -10,
            width: 30,
            height: 20,
            fill: 'white',
            stroke: 'black'
        },
        offsetLabelPositive: {
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fill: 'black',
            fontSize: 12
        },
        offsetLabelPositiveBody: {
            width: 120,
            height: 20,
            fill: 'white',
            stroke: 'black'
        },
        offsetLabelNegative: {
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fill: 'black',
            fontSize: 12
        },
        offsetLabelNegativeBody: {
            width: 120,
            height: 20,
            fill: 'white',
            stroke: 'black'
        },
        offsetLabelAbsolute: {
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fill: 'black',
            fontSize: 12,
            text: 'offsetLabelAbsolute',
            y: 50,
        },
        offsetLabelAbsoluteBody: {
            ref: 'offsetLabelAbsolute',
            fill: 'white',
            stroke: 'black',
            refWidth: '120%',
            refHeight: '120%',
            refX: '100%',
            refY: '100%',
            event: 'monitor:change:source',
            cursor: 'text'
        },
        offsetLabelPositiveConnector: {
            atConnectionRatio: 0.66,
            d: 'M 0 0 0 40',
            stroke: 'black',
            strokeDasharray: '5 5'
        },
        offsetLabelNegativeConnector: {
            atConnectionRatio: 0.66,
            d: 'M 0 0 0 -40',
            stroke: 'black',
            strokeDasharray: '5 5'
        },
        offsetLabelAbsoluteConnector: {
            atConnectionRatioIgnoreGradient: 0.66,
            d: 'M 0 0 -40 80',
            stroke: 'black',
            strokeDasharray: '5 5'
        }
    }
}, {
    markup: [{
        tagName: 'path',
        selector: 'line'
    }, {
        tagName: 'path',
        selector: 'offsetLabelPositiveConnector'
    }, {
        tagName: 'path',
        selector: 'offsetLabelNegativeConnector'
    }, {
        tagName: 'path',
        selector: 'offsetLabelAbsoluteConnector'
    }, {
        tagName: 'text',
        selector: 'offsetLabelMarker'
    }, {
        tagName: 'rect',
        selector: 'relativeLabelBody'
    }, {
        tagName: 'text',
        selector: 'relativeLabel'
    }, {
        tagName: 'rect',
        selector: 'absoluteLabelBody'
    }, {
        tagName: 'text',
        selector: 'absoluteLabel'
    }, {
        tagName: 'rect',
        selector: 'absoluteReverseLabelBody'
    }, {
        tagName: 'text',
        selector: 'absoluteReverseLabel'
    }, {
        tagName: 'rect',
        selector: 'offsetLabelPositiveBody'
    }, {
        tagName: 'text',
        selector: 'offsetLabelPositive'
    }, {
        tagName: 'rect',
        selector: 'offsetLabelNegativeBody'
    }, {
        tagName: 'text',
        selector: 'offsetLabelNegative'
    }, {
        tagName: 'rect',
        selector: 'offsetLabelAbsoluteBody'
    }, {
        tagName: 'text',
        selector: 'offsetLabelAbsolute'
    }]
});

export const CEPLink = joint.dia.Link.define('cep.Link2', {
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
    markup: [{
            tagName: 'path',
            selector: 'line'
        }, {
            tagName: 'path',
            selector: 'wrapper'
        }, {
            tagName: 'rect',
            selector: 'streamLabelBody'
        }, {
            tagName: 'text',
            selector: 'streamLabel',
        }, {
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
        children: [{
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
        }]
        }
    ]
});

// Custom Link

export const AnimatedLink = new joint.dia.Link({
    markup: [{
        tagName: 'path',
        selector: 'p1'
    }, {
        tagName: 'rect',
        selector: 'sign'
    }, {
        tagName: 'circle',
        selector: 'c1',
    }, {
        tagName: 'path',
        selector: 'p2'
    }, {
        tagName: 'circle',
        selector: 'c2'
    }, {
        tagName: 'text',
        selector: 'signText'
    }],
    source: { x: 380, y: 380 },
    target: { x: 740, y: 280 },
    vertices: [{ x: 600, y: 280 }],
    attrs: {
        p1: {
            connection: true,
            fill: 'none',
            stroke: 'black',
            strokeWidth: 6,
            strokeLinejoin: 'round'
        },
        p2: {
            connection: true,
            fill: 'none',
            stroke: '#fe854f',
            strokeWidth: 4,
            pointerEvents: 'none',
            strokeLinejoin: 'round',
            targetMarker: {
                'type': 'path',
                'fill': '#fe854f',
                'stroke': 'black',
                'stroke-width': 1,
                'd': 'M 10 -3 10 -10 -2 0 10 10 10 3'
            }
        },
        sign: {
            x: -20,
            y: -10,
            width: 40,
            height: 20,
            stroke: 'black',
            fill: '#fe854f',
            atConnectionLength: 30,
            strokeWidth: 1,
            event: 'myclick:rect'
        },
        signText: {
            atConnectionLength: 30,
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            pointerEvents: 'none',
            text: 'Link',
        },
        c1: {
            r: 10,
            stroke: 'black',
            fill: '#fe854f',
            atConnectionRatio: .5,
            strokeWidth: 1,
            event: 'myclick:circle',
            cursor: 'pointer'
        },
        c2: {
            r: 5,
            stroke: 'black',
            fill: 'white',
            atConnectionRatio: .5,
            strokeWidth: 1,
            pointerEvents: 'none'
        }
    }
});

