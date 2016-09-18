"use strict";

var utils = require("./utils");

module.exports = function sshkey(request) {
    return {
        get: function get(generate, cb) {
            if (typeof generate === "function") {
                cb = generate;
                generate = false;
            }

            var query = generate
                ? "?ensurePublicKey=1"
                : "";
            var url = "/api/sshkey/" + query;
            var action = "getting SSH key";

            request(url, utils.createJsonCallback(action, cb));
        }
    };
};
