"use strict";

var fs = require("fs");
var utils = require("./utils");
var httpError = utils.resolveHttpError;

module.exports = function zip(request) {
    return {
        download: function download(fromPath, toPath, cb) {
            request("/api/zip/" + fromPath, function (err, response) {
                err = err || httpError(response, "Error downloading zip file from " + fromPath + ".");

                cb(err, response);
            }).pipe(fs.createWriteStream(toPath));
        },

        upload: function upload(fromPath, toPath, cb) {
            fs.createReadStream(fromPath)
                .pipe(request.put("/api/zip/" + toPath, function (err, response, body) {
                    err = err || httpError(response, "Error uploading zip file to " + toPath + ".");

                    cb(err, body, response);
                }));
        }
    };
};
