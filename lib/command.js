"use strict";

var utils = require("./utils");

module.exports = function command(request) {
    return {
        exec: function exec(command, dir, cb) {
            if (typeof dir === "function") {
                cb = dir;
                dir = "";
            }

            var options = {
                uri: "/api/command",
                json: {
                    command: command,
                    dir: dir
                }
            };
            var action = "executing command " + command;

            request.post(options, utils.createBodyCallback(cb, action));
        }
    };
};
