"use strict";

var fs = require("fs");
var utils = require("./utils");

module.exports = function dump(request) {
    return {
        download: function download(dest, cb) {
            request("/api/dump", utils.createCallback("dumping diagnostic logs", cb))
                .pipe(fs.createWriteStream(dest));
        }
    };
};
