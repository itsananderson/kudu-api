"use strict";

var fs = require("fs");
var utils = require("./utils");

module.exports = function dump(request) {
    return {
        download: function download(dest, cb) {
            request("/api/dump", utils.createCallback(cb, "dumping diagnostic logs"))
                .pipe(fs.createWriteStream(dest));
        }
    };
};
