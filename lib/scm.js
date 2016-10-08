"use strict";

var utils = require("./utils");

module.exports = function scm(request) {
    return {
        info: function info(cb) {
            var options = {
                uri: "/api/scm/info",
                json: true
            };

            request(options, utils.createBodyCallback("getting information about the repository", cb));
        },

        clean: function clean(cb) {
            request.post("/api/scm/clean", utils.createCallback("cleaning the repository", cb));
        },

        del: function del(cb) {
            request.del("/api/scm", utils.createCallback("deleting the repository", cb));
        }
    };
};
