import { Component, Input } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-print-family-tree-button',
    templateUrl: './print-family-tree-button.component.html'
})
export class PrintFamilyTreeButtonComponent {
    @Input() rootFirstName: string;
    @Input() rootLastName: string;
    constructor() {}

    printTree(): void {
        const graph = document.getElementById('graph');
        const treeStyles = `
        .graph {
            font: 15px sans-serif;
            font-weight: 600;
        }
        .linage {
            fill: none;
            stroke: #b0bec5;
            stroke-width: 5;
        }
        .imageWrap {
            position: absolute;
            background-color: #fff;
            padding: 5px;
            border-radius: 100px;
            border: 5px solid;
        }
        .imageWrap embed {
            border-radius: 100px;
        }
        .imageWrap img {
            border-radius: 100px;
        }
        .imageDetail {
            clear: both;
            z-index: 2;
            margin-top: 180px;
        }
        .imageDetail p {
            margin: 0;
            padding: 0;
        }
        .marriage {
            fill: none;
            stroke: red;
            stroke-width: 5;
            /*stroke-dasharray: 0.5%;*/
        }
        .male {
            box-sizing: border-box;
            border-color: blue !important;
        }
        
        .death {
            background-color: gray !important;
        }
        .alive {
            background-color: green !important;
        }
        .female {
            box-sizing: border-box;
            border-color: pink !important;
        }
        
        .detail-column-name,
        .detail-column-value {
            padding: 5px;
            margin: 5px;
        }
        .tree-head {
            text-align: center
        }
        `;
        let popupWinindow = window.open('', '_blank', 'width=1000,height=1000,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWinindow.document.open();
        popupWinindow.document.write(`<html><head><style>${treeStyles}</style></head><body onload="window.print()">  ${graph.innerHTML} </html>`);
        popupWinindow.document.close();
    }

    saveImage(): void {
        const width = 1000;
        const height = 1000;
        const graph = document.getElementById('graph');
        const svgNode = graph.childNodes[0];
        const svgString = this.getSVGString(svgNode);
        this.svgString2Image(svgString, 2 * width, 2 * height, 'png', save); // passes Blob and filesize String to the callback
        function save(dataBlob, filesize) {
            saveAs(dataBlob, 'D3 vis exported to PNG.png'); // FileSaver.js function
        }
    }

    // Below are the functions that handle actual exporting:
    // getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
    getSVGString(svgNode) {
        svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        var cssStyleText = getCSSStyles(svgNode);
        appendCSS(cssStyleText, svgNode);

        var serializer = new XMLSerializer();
        var svgString = serializer.serializeToString(svgNode);
        svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
        svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

        return svgString;

        function getCSSStyles(parentElement) {
            var selectorTextArr = [];

            // Add Parent element Id and Classes to the list
            selectorTextArr.push('#' + parentElement.id);
            for (var c = 0; c < parentElement.classList.length; c++) if (!contains('.' + parentElement.classList[c], selectorTextArr)) selectorTextArr.push('.' + parentElement.classList[c]);

            // Add Children element Ids and Classes to the list
            var nodes = parentElement.getElementsByTagName('*');
            for (var i = 0; i < nodes.length; i++) {
                var id = nodes[i].id;
                if (!contains('#' + id, selectorTextArr)) selectorTextArr.push('#' + id);

                var classes = nodes[i].classList;
                for (var c = 0; c < classes.length; c++) if (!contains('.' + classes[c], selectorTextArr)) selectorTextArr.push('.' + classes[c]);
            }

            // Extract CSS Rules
            var extractedCSSText = '';
            for (var i = 0; i < document.styleSheets.length; i++) {
                var s = document.styleSheets[i];

                try {
                    if (!s.cssRules) continue;
                } catch (e) {
                    if (e.name !== 'SecurityError') throw e; // for Firefox
                    continue;
                }

                var cssRules: any = s.cssRules;
                for (var r = 0; r < cssRules.length; r++) {
                    if (contains(cssRules[r].selectorText, selectorTextArr)) extractedCSSText += cssRules[r].cssText;
                }
            }

            return extractedCSSText;

            function contains(str, arr) {
                return arr.indexOf(str) === -1 ? false : true;
            }
        }

        function appendCSS(cssText, element) {
            var styleElement = document.createElement('style');
            styleElement.setAttribute('type', 'text/css');
            styleElement.innerHTML = cssText;
            var refNode = element.hasChildNodes() ? element.children[0] : null;
            element.insertBefore(styleElement, refNode);
        }
    }

    svgString2Image(svgString, width, height, format, callback) {
        var format = format ? format : 'png';

        var imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        var image = new Image();
        image.onload = function () {
            context.clearRect(0, 0, width, height);
            context.drawImage(image, 0, 0, width, height);

            canvas.toBlob(function (blob: any) {
                var filesize = Math.round(blob.length / 1024) + ' KB';
                if (callback) callback(blob, filesize);
            });
        };

        image.src = imgsrc;
    }
}
