"use strict";

module.exports = function webjobs(request) {
    return {
        listAll: function listAll(cb) {
            request("/api/webjobs", function(err, response, body) {
                if (err) {
                    return cb(err);
                }

                cb(null, JSON.parse(body), response);
            });
        },

        listTriggered: function listTriggered(cb) {
            request("/api/triggeredwebjobs", function(err, response, body) {
                if (err) {
                    return cb(err);
                }

                cb(null, JSON.parse(body), response);
            });
        }
    };
};
