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
                'd': 'M 10 -5 0 0 10 5 z'
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
            fontSize: 12
        },
        offsetLabelAbsoluteBody: {
            width: 140,
            height: 20,
            fill: 'white',
            stroke: 'black'
        },
        offsetLabelMarker: {
            atConnectionRatio: 0.66,
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            text: 'X',
            fill: 'red',
            stroke: 'black',
            strokeWidth: 1.2,
            fontSize: 30,
            fontWeight: 'bold'
        },
        // offsetLabelPositiveConnector: {
        //     atConnectionRatio: 0.66,
        //     d: 'M 0 0 0 40',
        //     stroke: 'black',
        //     strokeDasharray: '5 5'
        // },
        // offsetLabelNegativeConnector: {
        //     atConnectionRatio: 0.66,
        //     d: 'M 0 0 0 -40',
        //     stroke: 'black',
        //     strokeDasharray: '5 5'
        // },
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