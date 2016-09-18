"use strict";

var utils = require("./utils");

module.exports = function settings(request) {
    return {
        list: function list(cb) {
            request("/api/settings", utils.createJsonCallback("listing settings", cb));
        },

        get: function get(key, cb) {
            var url = "/api/settings/" + encodeURIComponent(key);
            var action = "getting setting with key " + key;

            request(url, utils.createJsonCallback(action, cb));
        },

        del: function del(key, cb) {
            var url = "/api/settings/" + encodeURIComponent(key);
            var action = "deleting setting with key " + key;

            request.del(url, utils.createCallback(action, cb));
        },

        set: function set(settings, cb) {
            var options = {
                uri: "/api/settings/",
                json: settings
            };
            var action = "updating settings";

            request.post(options, utils.createCallback(action, cb));
        }
    };
};
