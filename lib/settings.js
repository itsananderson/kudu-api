"use strict";

var utils = require("./utils");

module.exports = function settings(request) {
    return {
        list: function list(cb) {
            request("/api/settings", utils.createJsonCallback(cb, "listing settings"));
        },

        get: function get(key, cb) {
            var url = "/api/settings/" + encodeURIComponent(key);
            var action = "getting setting with key " + key;

            request(url, utils.createJsonCallback(cb, action));
        },

        del: function del(key, cb) {
            var url = "/api/settings/" + encodeURIComponent(key);
            var action = "deleting setting with key " + key;

            request.del(url, utils.createCallback(cb, action));
        },

        set: function set(settings, cb) {
            var options = {
                uri: "/api/settings/",
                json: settings
            };
            var action = "updating settings";

            request.post(options, utils.createCallback(cb, action));
        }
    };
};
