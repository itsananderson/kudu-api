import * as utils from "./utils";
import { ApiResponse } from "./types";
import { RequestAPI, Request, CoreOptions, RequiredUriUrl } from "request";

interface Logs {
  recent: (query?: {}) => Promise<ApiResponse<string[]>>;
}

export default function logs(
  request: RequestAPI<Request, CoreOptions, RequiredUriUrl>
): Logs {
  return {
    recent: function recent(query = {}): Promise<ApiResponse<string[]>> {
      const options = {
        uri: "/api/logs/recent",
        qs: query,
        json: true,
      };
      const action = "retrieving application logs";

      return new Promise<ApiResponse<string[]>>((resolve, reject) => {
        request(options, utils.createPromiseCallback(action, resolve, reject));
      });
    },
  };
}
