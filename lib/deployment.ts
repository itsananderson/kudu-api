import * as utils from "./utils";

export default function deployment(request) {
    return {
        list: function list(cb) {
            var options = {
                uri: "/api/deployments/",
                json: true
            };

            request(options, utils.createCallback("listing deployments", cb));
        },

        get: function get(id, cb) {
            var options = {
                uri: "/api/deployments/" + encodeURIComponent(id),
                json: true
            };
            var action = "getting deployment with id " + id;

            request(options, utils.createCallback(action, cb));
        },

        del: function del(id, cb) {
            var url = "/api/deployments/" + encodeURIComponent(id);
            var action = "deleting deployment with id " + id;

            request.del(url, utils.createCallback(action, cb));
        },

        log: function log(id, cb) {
            var options = {
                uri: "/api/deployments/" + encodeURIComponent(id) + "/log",
                json: true
            };
            var action = "listing logs for deployment with id " + id;

            request(options, utils.createCallback(action, cb));
        },

        logDetails: function logDetails(id, entryId, cb) {
            var options = {
                uri: "/api/deployments/" + encodeURIComponent(id) + "/log/" + encodeURIComponent(entryId),
                json: true
            };
            var action = "getting log details with log id " + id + " and entry id " + entryId;

            request(options, utils.createCallback(action, cb));
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
}
