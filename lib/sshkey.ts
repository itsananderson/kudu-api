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
    get: function get(generate = false): Promise<ApiResponse<string>> {
      const query = { ensurePublicKey: generate ? 1 : undefined };

      const options = {
        uri: "/api/sshkey/",
        qs: query,
        json: true,
      };
      const action = "getting SSH key";

      return new Promise<ApiResponse<string>>((resolve, reject) => {
        request(options, utils.createPromiseCallback(action, resolve, reject));
      });
    },
  };
}
