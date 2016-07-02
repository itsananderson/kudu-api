"use strict";

module.exports = function webjobs(request) {
    return {
        listAll: function listAll(cb) {
            request("/api/webjobs", function (err, response, body) {
                if (err) {
                    return cb(err);
                }

                cb(null, JSON.parse(body), response);
            });
        },

        listTriggered: function listTriggered(cb) {
            request("/api/triggeredwebjobs", function (err, response, body) {
                if (err) {
                    return cb(err);
                }

                cb(null, JSON.parse(body), response);
            });
        },

        listTriggeredAsSwagger: function listTriggered(cb) {
            request("/api/triggeredwebjobsswagger", function (err, response, body) {
                if (err) {
                    return cb(err);
                }

                cb(null, JSON.parse(body), response);
            });
        },

        getTriggered: function getTriggered(name, cb) {
            request("/api/triggeredwebjobs/" + name, function (err, response, body) {
                if (err) {
                    return cb(err);
                }

                if (response.statusCode >= 400) {
                    return cb(new Error("Error getting triggered webjob with name '" + name + "'. Status code " + response.statusCode + " (" + response.statusMessage + ")."));
                }

                cb(null, JSON.parse(body), response);
            });
        }
    };
};
