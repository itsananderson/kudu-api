"use strict";

var utils = require("./utils");

module.exports = function diagnostics(request) {
    return {
        list: function list(cb) {
            request("/api/diagnostics/settings", utils.createJsonCallback(cb, "listing diagnostic settings"));
        },

        get: function get(key, cb) {
            var url = "/api/diagnostics/settings/" + encodeURIComponent(key);
            var action = "getting diagnostic settiing with key " + key;

            request(url, utils.createJsonCallback(cb, action));
        },

        del: function del(key, cb) {
            var url = "/api/diagnostics/settings/" + encodeURIComponent(key);
            var action = "deleting diagnostic settiing with key " + key;

            request.del(url, utils.createCallback(cb, action));
        },

        set: function set(settings, cb) {
            var options = {
                uri: "/api/diagnostics/settings/",
                json: settings
            };
            var action = "setting diagnostic settings";

            request.post(options, utils.createCallback(cb, action));
        }
    };
};
