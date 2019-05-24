"use strict";

var utils = require("./utils");

module.exports = function extensions(request) {
    function extension(baseUrl) {
        return {
            list: function list(filter, cb) {
                var query = {};

                if (typeof filter === "function") {
                    cb = filter;
                } else if (filter) {
                    query.filter = filter;
                }

                var options = {
                    uri: baseUrl,
                    qs: query,
                    json: true
                };
                var action = "listing extensions";

                request(options, utils.createCallback(action, cb));
            },

            get: function get(id, cb) {
                var options = {
                    uri: baseUrl + "/" + encodeURIComponent(id),
                    json: true
                };
                var action = "getting extension with id " + id;

                request(options, utils.createCallback(action, cb));
            }
        };
    }

    var feed = extension("/api/extensionfeed");
    var site = extension("/api/siteextensions");

    site.del = function del(id, cb) {
        var options = {
            uri: "/api/siteextensions/" + encodeURIComponent(id),
            json: true
        };
        var action = "deleting extension with id " + id;

        request.del(options, utils.createCallback(action, cb));
    };

    site.set = function set(id, payload, cb) {
        var options = {
            uri: "/api/siteextensions/" + encodeURIComponent(id),
            json: payload
        };
        var action = "installing or updating extension with id " + id;

        request.put(options, utils.createCallback(action, cb));
    };

    return {
        feed: feed,
        site: site
    };
};
