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
}