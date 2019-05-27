import * as utils from "./utils";
import { RequestAPI, Request, CoreOptions, RequiredUriUrl } from "request";
import { ApiResponse } from "./types";

interface SshKey {
  get: (generate?: boolean) => Promise<ApiResponse<string>>;
}

export default function sshkey(
  request: RequestAPI<Request, CoreOptions, RequiredUriUrl>
): SshKey {
  return {
    get: function get(generate: boolean = false): Promise<ApiResponse<string>> {
      var query = { ensurePublicKey: generate ? 1 : undefined };

      var options = {
        uri: "/api/sshkey/",
        qs: query,
        json: true
      };
      var action = "getting SSH key";

      return new Promise<ApiResponse<string>>((resolve, reject) => {
        request(options, utils.createPromiseCallback(action, resolve, reject));
      });
    }
  };
}
