var Canvas = require('canvas');
var Image = Canvas.Image;

function noop() {}

/**
 * value to character mapping from dark to light
 * add more characters and they will be accounted for automatically
 * note: the extra &nbsp; is to account for the value range inclusive of 100%
 */
var chars = ['@','#','$','=','*','!',';',':','~','-',',','.','&nbsp;', '&nbsp;'];
var charLen = chars.length - 1;

function getChar(val) {
    return chars[parseInt(val*charLen, 10)];
}

/**
 * Jscii
 *
 * @constructor
 * @param {Image} params.img
 * @param {Number} params.width - image width for downscale (in px)
 * @param {Boolean} params.color - enable color ascii (highly experimental)
 */
function Jscii(params) {
    var self = this;

    this.el = params.img;
    this.width = (params.width | 0) || 150;
    this.color = !!params.color;

    this.canvas = new Canvas(200, 200);
    this.ctx = this.canvas.getContext('2d');

    this.render();
}

/**
 * getter/setter for output dimension
 */
Jscii.prototype.dimension = function(width, height) {
    if (typeof width === 'number' && typeof height === 'number') {
        this._scaledWidth = this.canvas.width = +width;
        this._scaledHeight = this.canvas.height = +height;
        return this;
    }

    return {
        width: this._scaledWidth,
        height: this._scaledHeight
    };
};

/**
 * gets context image data, perform ascii conversion, append string to container
 */
Jscii.prototype.render = function () {
    var el = this.el, nodeName = el.nodeName, ratio;
    var dim = this.dimension(), width, height;

    if (!dim.width || !dim.height) {
        ratio = el.height / el.width;
        width = this.width | 0;
        height = (width * ratio) | 0;
        this.dimension(width, height);
        dim = this.dimension();
    }

    width = dim.width;
    height = dim.height;

    if (!width || !height) {
        console.log('WASTED');
        return;
    }

    this.ctx.drawImage(this.el, 0, 0, width, height);
    this.imageData = this.ctx.getImageData(0, 0, width, height).data;
    return this.getAsciiString();
};

/**
 * given a picture/frame's pixel data and a defined width and height
 * return the ASCII string representing the image
 */
Jscii.prototype.getAsciiString = function () {
    var dim = this.dimension(),
        width = dim.width,
        height = dim.height,
        len = width * height,
        d = this.imageData,
        str = '',
        i,
        rgb,
        val;

    // helper function to retrieve rgb value from pixel data
    function getRGB(i) {
        return [d[i=i*4], d[i+1], d[i+2]];
    }

    for(i = 0; i < len; i++) {
        if (i % width === 0) {
            str += '\\n';
        }

        rgb = getRGB(i);
        val = Math.max(rgb[0], rgb[1], rgb[2])/255;

        if (this.color) {
            str += '<font style="color: rgb('+rgb.join(',')+')">'+getChar(val)+'</font>';
        } else {
            str += getChar(val);
        }
    }
    return str;
};

module.exports = Jscii;
