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
            request("/api/webjobs", utils.createJsonCallback("listing all webjobs", cb));
        },

        listTriggered: function listTriggered(cb) {
            request("/api/triggeredwebjobs", utils.createJsonCallback("listing triggered webjobs", cb));
        },

        listTriggeredAsSwagger: function listTriggeredAsSwagger(cb) {
            request("/api/triggeredwebjobsswagger", utils.createJsonCallback("listing triggered webjobs as swagger", cb));
        },

        getTriggered: function getTriggered(name, cb) {
            var url = "/api/triggeredwebjobs/" + encodeURIComponent(name);
            var action = "getting triggered webjob with name '" + name + "'";

            request(url, utils.createJsonCallback(action, cb));
        },

        uploadTriggered: function uploadTriggered(name, localPath, cb) {
            var options = {
                uri: "/api/triggeredwebjobs/" + encodeURIComponent(name),
                headers: createUploadHeaders(localPath)
            };
            var action = "uploading triggered webjob with name '" + name + "'";

            fs.createReadStream(localPath)
                .on("error", cb)
                .pipe(request.put(options, utils.createJsonCallback(action, cb)));
        },

        deleteTriggered: function deleteTriggered(name, cb) {
            var url = "/api/triggeredwebjobs/" + encodeURIComponent(name);
            var action = "deleting triggered webjob with name '" + name + "'";

            request.del(url, utils.createCallback(action, cb));
        },

        runTriggered: function runTriggered(name, args, cb) {
            var url = "/api/triggeredwebjobs/" + encodeURIComponent(name) + "/run";
            var action = "running triggered webjob with name '" + name + "'";

            if (typeof args === "function") {
                cb = args;
            } else if (typeof args === "string") {
                url += "?arguments=" + encodeURIComponent(args);
            }

            request.post(url, utils.createCallback(action, cb));
        },

        listTriggeredHistory: function listTriggeredHistory(name, cb) {
            var url = "/api/triggeredwebjobs/" + encodeURIComponent(name) + "/history";
            var action = "listing history for triggered webjob with name '" + name + "'";

            request(url, utils.createJsonCallback(action, cb));
        },

        getTriggeredHistory: function getTriggeredHistory(name, id, cb) {
            var url = "/api/triggeredwebjobs/" + encodeURIComponent(name) + "/history/" + encodeURIComponent(id);
            var action = "getting history for triggered webjob with name '" + name + "' and id '" + id + "'";

            request(url, utils.createJsonCallback(action, cb));
        },

        listContinuous: function listContinuous(cb) {
            request("/api/continuouswebjobs", utils.createJsonCallback("listing continuous webjobs", cb));
        },

        getContinuous: function getContinuous(name, cb) {
            var url = "/api/continuouswebjobs/" + encodeURIComponent(name);
            var action = "getting continuous webjob with name '" + name + "'";

            request(url, utils.createJsonCallback(action, cb));
        },

        uploadContinuous: function uploadContinuous(name, localPath, cb) {
            var options = {
                uri: "/api/continuouswebjobs/" + encodeURIComponent(name),
                headers: createUploadHeaders(localPath)
            };
            var action = "uploading continuous webjob with name '" + name + "'";

            fs.createReadStream(localPath)
                .on("error", cb)
                .pipe(request.put(options, utils.createJsonCallback(action, cb)));
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
            var url = "/api/continuouswebjobs/" + encodeURIComponent(name) + "/settings";
            var action = "getting continuous webjob settings with name '" + name + "'";

            request.get(url, utils.createJsonCallback(action, cb));
        },

        setContinuousSettings: function setContinuousSettings(name, settings, cb) {
            var options = {
                uri: "/api/continuouswebjobs/" + encodeURIComponent(name) + "/settings",
                body: settings,
                json: true
            };
            var action = "setting continuous webjob settings with name '" + name + "'";

            request.put(options, utils.createCallback(action, cb));
        }
    };
};
