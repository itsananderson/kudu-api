"use strict";

var utils = require("./utils");

module.exports = function scm(request) {
    return {
        info: function info(cb) {
            request("/api/scm/info", utils.createJsonCallback(cb, "getting information about the repository"));
        },

        clean: function clean(cb) {
            request.post("/api/scm/clean", utils.createCallback(cb, "cleaning the repository"));
        },

        del: function del(cb) {
            request.del("/api/scm", utils.createCallback(cb, "deleting the repository"));
        }
    };
};
