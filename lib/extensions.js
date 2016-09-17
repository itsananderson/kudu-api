"use strict";

var utils = require("./utils");

module.exports = function extensions(request) {
    function extension(baseUrl) {
        return {
            list: function list(filter, cb) {
                if (typeof filter === "function") {
                    cb = filter;
                    filter = null;
                }

                var query = filter
                    ? "?filter=" + filter
                    : "";
                var url = baseUrl + query;
                var action = "listing extensions";

                request(url, utils.createJsonCallback(cb, action));
            },

            get: function get(id, cb) {
                var url = baseUrl + "/" + encodeURIComponent(id);
                var action = "getting extension with id " + id;

                request(url, utils.createJsonCallback(cb, action));
            }
        };
    }

    var feed = extension("/api/extensionfeed");
    var site = extension("/api/siteextensions");

    site.del = function del(id, cb) {
        var url = "/api/siteextensions/" + encodeURIComponent(id);
        var action = "deleting extension with id " + id;

        request.del(url, utils.createJsonCallback(cb, action));
    };

    site.set = function set(id, payload, cb) {
        var options = {
            uri: "/api/siteextensions/" + encodeURIComponent(id),
            json: payload
        };
        var action = "installing or updating extension with id " + id;

        // Because the request explicitly uses JSON the body will already be parsed
        request.put(options, utils.createBodyCallback(cb, action));
    };

    return {
        feed: feed,
        site: site
    };
};
