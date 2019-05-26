import * as utils from "./utils";

export interface Command {
    exec: (command, dir, cb) => void;
}

export default function command(request): Command {
    return {
        exec: function exec(command, dir, cb): void {
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
