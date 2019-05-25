import * as utils from "./utils";

export default function command(request) {
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

            request.post(options, utils.createCallback(action, cb));
        }
    };
}
