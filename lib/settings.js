"use strict";

var utils = require("./utils");

module.exports = function settings(request) {
    return {
        list: function list(cb) {
            var options = {
                uri: "/api/settings",
                json: true
            };

            request(options, utils.createBodyCallback("listing settings", cb));
        },

        get: function get(key, cb) {
            var options = {
                uri: "/api/settings/" + encodeURIComponent(key),
                json: true
            };
            var action = "getting setting with key " + key;

            request(options, utils.createBodyCallback(action, cb));
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
