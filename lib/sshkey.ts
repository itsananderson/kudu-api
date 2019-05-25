"use strict";

var utils = require("./utils");

module.exports = function sshkey(request) {
    return {
        get: function get(generate, cb) {
            var query = { ensurePublicKey: undefined };

            if (typeof generate === "function") {
                cb = generate;
            } else if (generate) {
                query.ensurePublicKey = 1;
            }

            var options = {
                uri: "/api/sshkey/",
                qs: query,
                json: true
            };
            var action = "getting SSH key";

            request(options, utils.createCallback(action, cb));
        }
    };
};
