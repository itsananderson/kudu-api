import { RequestAPI, Request, CoreOptions, RequiredUriUrl } from "request";
import { createPromiseCallback } from "./utils";
import { ApiResponse } from "./types";

export interface Command {
  exec: (command: string, dir?: string) => Promise<ApiResponse<ExecResult>>;
}

export interface ExecResult {
  ExitCode: number;
  Error: string;
  Output: string;
}

export default function command(
  request: RequestAPI<Request, CoreOptions, RequiredUriUrl>
): Command {
  return {
    exec: function exec(command, dir = ""): Promise<ApiResponse<ExecResult>> {
      var options = {
        uri: "/api/command",
        json: {
          command: command,
          dir: dir
        }
      };
      var action = "executing command " + command;

      return new Promise<ApiResponse<ExecResult>>((resolve, reject) => {
        request.post(options, createPromiseCallback(action, resolve, reject));
      });
    }
  };
}
