"use strict";

var fs = require("fs");
var path = require("path");

function resolveError(response, message) {
    if (response.statusCode < 400) {
        return;
    }

    message = message
        ? message + " "
        : "";

    message += "Status code " + response.statusCode + " (" + response.statusMessage + ").";

    if (response.body) {
        message += " " + response.body;
    }

    return new Error(message);
}

function createUploadHeaders(localPath) {
    var fileName = path.basename(localPath);
    var contentType = path.extname(localPath).toLowerCase() === ".zip"
        ? "application/zip"
        : "application/octet-stream";

    return {
        "Content-Disposition": "attachment; filename=" + fileName,
        "Content-Type": contentType
    };
}

module.exports = function webjobs(request) {
    return {
        listAll: function listAll(cb) {
            request("/api/webjobs", function (err, response) {
                err = err || resolveError(response, "Error listing all webjobs.");

                if (err) {
                    return cb(err);
                }

                cb(null, JSON.parse(response.body), response);
            });
        },

        listTriggered: function listTriggered(cb) {
            request("/api/triggeredwebjobs", function (err, response) {
                err = err || resolveError(response, "Error listing triggered webjobs.");

                if (err) {
                    return cb(err);
                }

                cb(null, JSON.parse(response.body), response);
            });
        },

        listTriggeredAsSwagger: function listTriggeredAsSwagger(cb) {
            request("/api/triggeredwebjobsswagger", function (err, response) {
                err = err || resolveError(response, "Error listing triggered webjobs as swagger.");

                if (err) {
                    return cb(err);
                }

                cb(null, JSON.parse(response.body), response);
            });
        },

        getTriggered: function getTriggered(name, cb) {
            request("/api/triggeredwebjobs/" + encodeURIComponent(name), function (err, response) {
                err = err || resolveError(response, "Error getting triggered webjob with name '" + name + "'.");

                if (err) {
                    return cb(err);
                }

                cb(null, JSON.parse(response.body), response);
            });
        },

        uploadTriggered: function uploadTriggered(name, localPath, cb) {
            var options = {
                uri: "/api/triggeredwebjobs/" + encodeURIComponent(name),
                headers: createUploadHeaders(localPath)
            };

            fs.createReadStream(localPath)
                .on("error", cb)
                .pipe(request.put(options, function (err, response) {
                    err = err || resolveError(response, "Error uploading triggered webjob with name '" + name + "'.");

                    if (err) {
                        return cb(err);
                    }

                    cb(null, JSON.parse(response.body), response);
                }));
        },

        deleteTriggered: function deleteTriggered(name, cb) {
            request.del("/api/triggeredwebjobs/" + encodeURIComponent(name), function (err, response) {
                err = err || resolveError(response, "Error deleting triggered webjob with name '" + name + "'.");

                if (err) {
                    return cb(err);
                }

                cb(null, response);
            });
        },

        runTriggered: function runTriggered(name, args, cb) {
            var url = "/api/triggeredwebjobs/" + encodeURIComponent(name) + "/run";

            if (typeof args === "function") {
                cb = args;
            } else if (typeof args === "string") {
                url += "?arguments=" + encodeURIComponent(args);
            }

            request.post(url, function (err, response) {
                err = err || resolveError(response, "Error running triggered webjob with name '" + name + "'.");

                if (err) {
                    return cb(err);
                }

                cb(null, response);
            });
        },

        listTriggeredHistory: function listTriggeredHistory(name, cb) {
            request("/api/triggeredwebjobs/" + encodeURIComponent(name) + "/history", function (err, response) {
                err = err || resolveError(response, "Error listing history for triggered webjob with name '" + name + "'.");

                if (err) {
                    return cb(err);
                }

                cb(null, JSON.parse(response.body), response);
            });
        },

        getTriggeredHistory: function getTriggeredHistory(name, id, cb) {
            request("/api/triggeredwebjobs/" + encodeURIComponent(name) + "/history/" + encodeURIComponent(id), function (err, response) {
                err = err || resolveError(response, "Error getting history for triggered webjob with name '" + name + "' and id '" + id + "'.");

                if (err) {
                    return cb(err);
                }

                cb(null, JSON.parse(response.body), response);
            });
        }
    };
};
