var fs = require('fs');
var path = require('path');
var loader = require('../index');

var test1 = new Promise(function (resolve, reject) {
    var it = 'png should be good';

    fs.readFile(path.join(__dirname, 'cute-little-cat.png'), function (err, stream) {
        var ascii = loader(stream);
        if (typeof ascii !== 'string') {
            reject(it);
        } else {
            console.log(ascii);
            resolve(it);
        }
    });
});

var test2 = new Promise(function (resolve, reject) {
    var it = 'jpg should be bad';

    fs.readFile(path.join(__dirname, 'cute-little-cat.jpg'), function (err, stream) {
        try {
            loader(stream);
            reject(it);
        } catch (e) {
            resolve(it);
        }
    });
});

function pass() {
    var messages = [].slice.call(arguments);
    console.log.apply(console, ['PASS:'].concat(messages));
    process.exit(0);
}

function fail() {
    var messages = [].slice.call(arguments);
    console.error.apply(console, ['FAIL:'].concat(messages));
    process.exit(-1);
}

Promise.all([test1, test2]).then(pass, fail);
