var loaderUtils = require('loader-utils');
var Image = require('canvas').Image;
var Jscii = require('./jscii');

module.exports = function (source) {
    if (this.cacheable) { this.cacheable(); }

    var img = new Image;
    img.src = source;
    if (!img.complete) {
        throw new Error('[asciiart-loader]: could not load image');
    }

    var params = loaderUtils.parseQuery(this.query);
    params.img = img;

    var jscii = new Jscii(params);
    return 'module.exports = \'' + jscii.render() + '\';';
};

module.exports.raw = true;
