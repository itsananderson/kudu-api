"use strict";

var utils = require("./utils");

module.exports = function deployment(request) {
    return {
        list: function list(cb) {
            request("/api/deployments/", utils.createJsonCallback("listing deployments", cb));
        },

        get: function get(id, cb) {
            var url = "/api/deployments/" + encodeURIComponent(id);
            var action = "getting deployment with id " + id;

            request(url, utils.createJsonCallback(action, cb));
        },

        del: function del(id, cb) {
            var url = "/api/deployments/" + encodeURIComponent(id);
            var action = "deleting deployment with id " + id;

            request.del(url, utils.createCallback(action, cb));
        },

        log: function log(id, cb) {
            var url = "/api/deployments/" + encodeURIComponent(id) + "/log";
            var action = "listing logs for deployment with id " + id;

            request(url, utils.createJsonCallback(action, cb));
        },

        logDetails: function logDetails(id, entryId, cb) {
            var url = "/api/deployments/" + encodeURIComponent(id) + "/log/" + encodeURIComponent(entryId);
            var action = "getting log details with log id " + id + " and entry id " + entryId;

            request(url, utils.createJsonCallback(action, cb));
        },

        deploy: function deploy(repoUrl, cb) {
            var options = {
                uri: "/deploy/",
                json: {
                    format: "basic",
                    url: repoUrl
                }
            };
            var action = "triggering a deployment from the repository " + repoUrl;

            request.post(options, utils.createCallback(action, cb));
        },

        redeploy: function redeploy(id, payload, cb) {
            if (typeof payload === "function") {
                cb = payload;
                payload = undefined;
            }

            var options = {
                uri: "/api/deployments/" + encodeURIComponent(id),
                json: payload || {}
            };
            var action = "triggering a redeployment with id " + id;

            request.put(options, utils.createCallback(action, cb));
        }
    };
};
