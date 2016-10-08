"use strict";

var utils = require("./utils");

module.exports = function environment(request) {
    return {
        get: function get(cb) {
            var options = {
                uri: "/api/environment",
                json: true
            };

            request(options, utils.createBodyCallback("getting the Kudu environment", cb));
        }
    };
};
