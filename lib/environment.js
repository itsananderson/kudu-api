"use strict";

var utils = require("./utils");

module.exports = function environment(request) {
    return {
        get: function get(cb) {
            request("/api/environment", utils.createJsonCallback(cb, "getting the Kudu environment"));
        }
    };
};
