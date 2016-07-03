"use strict";

function resolveError(response, message) {
    if (response.statusCode < 400) {
        return;
    }

    message = message
        ? message + " "
        : "";

    message += "Status code " + response.statusCode + " (" + response.statusMessage + ").";

    if (response.body) {
        message += " " + response.body;
    }

    return new Error(message);
}

module.exports = function webjobs(request) {
    return {
        listAll: function listAll(cb) {
            request("/api/webjobs", function (err, response) {
                err = err || resolveError(response, "Error listing all webjobs.");

                if (err) {
                    return cb(err);
                }

                cb(null, JSON.parse(response.body), response);
            });
        },

        listTriggered: function listTriggered(cb) {
            request("/api/triggeredwebjobs", function (err, response) {
                err = err || resolveError(response, "Error listing triggered webjobs.");

                if (err) {
                    return cb(err);
                }

                cb(null, JSON.parse(response.body), response);
            });
        },

        listTriggeredAsSwagger: function listTriggered(cb) {
            request("/api/triggeredwebjobsswagger", function (err, response) {
                err = err || resolveError(response, "Error listing triggered webjobs as swagger.");

                if (err) {
                    return cb(err);
                }

                cb(null, JSON.parse(response.body), response);
            });
        },

        getTriggered: function getTriggered(name, cb) {
            request("/api/triggeredwebjobs/" + name, function (err, response) {
                err = err || resolveError(response, "Error getting triggered webjob with name '" + name + "'.");

                if (err) {
                    return cb(err);
                }

                cb(null, JSON.parse(response.body), response);
            });
        }
    };
};
