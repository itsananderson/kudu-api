"use strict";

var fs = require("fs");
var path = require("path");
var utils = require("./utils");

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
            var options = {
                uri: "/api/webjobs",
                json: true
            };

            request(options, utils.createBodyCallback("listing all webjobs", cb));
        },

        listTriggered: function listTriggered(cb) {
            var options = {
                uri: "/api/triggeredwebjobs",
                json: true
            };

            request(options, utils.createBodyCallback("listing triggered webjobs", cb));
        },

        listTriggeredAsSwagger: function listTriggeredAsSwagger(cb) {
            var options = {
                uri: "/api/triggeredwebjobsswagger",
                json: true
            };

            request(options, utils.createBodyCallback("listing triggered webjobs as swagger", cb));
        },

        getTriggered: function getTriggered(name, cb) {
            var options = {
                uri: "/api/triggeredwebjobs/" + encodeURIComponent(name),
                json: true
            };
            var action = "getting triggered webjob with name '" + name + "'";

            request(options, utils.createBodyCallback(action, cb));
        },

        uploadTriggered: function uploadTriggered(name, localPath, cb) {
            var options = {
                uri: "/api/triggeredwebjobs/" + encodeURIComponent(name),
                json: true,
                headers: createUploadHeaders(localPath)
            };
            var action = "uploading triggered webjob with name '" + name + "'";

            fs.createReadStream(localPath)
                .on("error", cb)
                .pipe(request.put(options, utils.createBodyCallback(action, cb)));
        },

        deleteTriggered: function deleteTriggered(name, cb) {
            var url = "/api/triggeredwebjobs/" + encodeURIComponent(name);
            var action = "deleting triggered webjob with name '" + name + "'";

            request.del(url, utils.createCallback(action, cb));
        },

        runTriggered: function runTriggered(name, args, cb) {
            var query = {};
            
            if (typeof args === "function") {
                cb = args;
            } else if (args) {
                query.arguments = args;
            }

            var options = {
                url: "/api/triggeredwebjobs/" + encodeURIComponent(name) + "/run",
                qs: query
            };
            var action = "running triggered webjob with name '" + name + "'";

            request.post(options, utils.createCallback(action, cb));
        },

        listTriggeredHistory: function listTriggeredHistory(name, cb) {
            var options = {
                uri: "/api/triggeredwebjobs/" + encodeURIComponent(name) + "/history",
                json: true
            };
            var action = "listing history for triggered webjob with name '" + name + "'";

            request(options, utils.createBodyCallback(action, cb));
        },

        getTriggeredHistory: function getTriggeredHistory(name, id, cb) {
            var options = {
                uri: "/api/triggeredwebjobs/" + encodeURIComponent(name) + "/history/" + encodeURIComponent(id),
                json: true
            };
            var action = "getting history for triggered webjob with name '" + name + "' and id '" + id + "'";

            request(options, utils.createBodyCallback(action, cb));
        },

        listContinuous: function listContinuous(cb) {
            var options = {
                uri: "/api/continuouswebjobs",
                json: true
            };

            request(options, utils.createBodyCallback("listing continuous webjobs", cb));
        },

        getContinuous: function getContinuous(name, cb) {
            var options = {
                uri: "/api/continuouswebjobs/" + encodeURIComponent(name),
                json: true
            };
            var action = "getting continuous webjob with name '" + name + "'";

            request(options, utils.createBodyCallback(action, cb));
        },

        uploadContinuous: function uploadContinuous(name, localPath, cb) {
            var options = {
                uri: "/api/continuouswebjobs/" + encodeURIComponent(name),
                json: true,
                headers: createUploadHeaders(localPath)
            };
            var action = "uploading continuous webjob with name '" + name + "'";

            fs.createReadStream(localPath)
                .on("error", cb)
                .pipe(request.put(options, utils.createBodyCallback(action, cb)));
        },

        deleteContinuous: function deleteContinuous(name, cb) {
            var url = "/api/continuouswebjobs/" + encodeURIComponent(name);
            var action = "deleting continuous webjob with name '" + name + "'";

            request.del(url, utils.createCallback(action, cb));
        },

        startContinuous: function startContinuous(name, cb) {
            var url = "/api/continuouswebjobs/" + encodeURIComponent(name) + "/start";
            var action = "starting continuous webjob with name '" + name + "'";

            request.post(url, utils.createCallback(action, cb));
        },

        stopContinuous: function stopContinuous(name, cb) {
            var url = "/api/continuouswebjobs/" + encodeURIComponent(name) + "/stop";
            var action = "stopping continuous webjob with name '" + name + "'";

            request.post(url, utils.createCallback(action, cb));
        },

        getContinuousSettings: function getContinuousSettings(name, cb) {
            var options = {
                uri: "/api/continuouswebjobs/" + encodeURIComponent(name) + "/settings",
                json: true
            };
            var action = "getting continuous webjob settings with name '" + name + "'";

            request.get(options, utils.createBodyCallback(action, cb));
        },

        setContinuousSettings: function setContinuousSettings(name, settings, cb) {
            var options = {
                uri: "/api/continuouswebjobs/" + encodeURIComponent(name) + "/settings",
                json: settings
            };
            var action = "setting continuous webjob settings with name '" + name + "'";

            request.put(options, utils.createCallback(action, cb));
        }
    };
};
