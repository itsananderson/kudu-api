"use strict";

var fs = require("fs");
var utils = require("./utils");

module.exports = function zip(request) {
    return {
        download: function download(fromPath, toPath, cb) {
            var url = "/api/zip/" + fromPath;
            var action = "downloading zip file from " + fromPath;

            var callbackWrapper = utils.createCallback(action, cb);

            var response;
            request(url)
                .on("response", function(res) {
                  response = res;
                })
                .on("error", err => callbackWrapper(err, response))
                .pipe(fs.createWriteStream(toPath))
                .on("close", () => callbackWrapper(null, response));
        },

        upload: function upload(fromPath, toPath, cb) {
            var url = "/api/zip/" + toPath;
            var action = "uploading zip file to " + toPath;

            fs.createReadStream(fromPath)
                .pipe(request.put(url, utils.createCallback(action, cb)));
        }
    };
};
