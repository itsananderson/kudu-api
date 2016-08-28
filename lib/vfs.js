"use strict";

var fs = require("fs");
var utils = require("./utils");

function ensureTrailingSlash(path) {
    if ("/" !== path[path.length - 1]) {
        path += "/";
    }

    return path;
}

module.exports = function vfs(request) {
    return {
        getFile: function getFile(path, cb) {
            var url = "/api/vfs/" + path;
            var action = "getting file with path " + path;

            request(url, function (err, response, body) {
                err = err || utils.resolveHttpError(response, "Error " + action + ".");

                if (err) {
                    return cb(err);
                }

                cb(null, body, response);
            });
        },

        listFiles: function listFiles(path, cb) {
            path = ensureTrailingSlash(path);

            var url = "/api/vfs/" + path;
            var action = "listing files with path " + path;

            request(url, utils.createJsonCallback(cb, action));
        },

        uploadFile: function uploadFile(localPath, destPath, etag, cb) {
            if (typeof etag === "function") {
                cb = etag;
                etag = "*";
            }

            var options = {
                uri: "/api/vfs/" + destPath,
                headers: {
                    "If-Match": etag
                }
            };
            var action = "uploading file to destination " + destPath;

            fs.createReadStream(localPath)
                .pipe(request.put(options, utils.createCallback(cb, action)));
        },

        createDirectory: function createDirectory(path, cb) {
            path = ensureTrailingSlash(path);

            var url = "/api/vfs/" + path;
            var action = "creating directory with path " + path;

            request.put(url, utils.createCallback(cb, action));
        },

        deleteFile: function deleteFile(path, etag, cb) {
            if (typeof etag === "function") {
                cb = etag;
                etag = "*";
            }

            var options = {
                uri: "/api/vfs/" + path,
                headers: {
                    "If-Match": etag
                }
            };
            var action = "deleting file with path " + path;

            request.del(options, utils.createCallback(cb, action));
        },

        deleteDirectory: function deleteDirectory(path, cb) {
            path = ensureTrailingSlash(path);

            var url = "/api/vfs/" + path;
            var action = "deleting directory with path " + path;

            request.del(url, utils.createCallback(cb, action));
        }
    };
};
