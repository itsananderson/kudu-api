import * as utils from "./utils";
import { ApiResponse } from "./types";
import { RequestAPI, Request, CoreOptions, RequiredUriUrl } from "request";

export type KuduEnvironment = {
  [key: string]: string;
};

export interface EnvironmentApi {
  get: () => Promise<ApiResponse<KuduEnvironment>>;
}

export default function environment(
  request: RequestAPI<Request, CoreOptions, RequiredUriUrl>
): EnvironmentApi {
  return {
    get: function get(): Promise<ApiResponse<KuduEnvironment>> {
      var options = {
        uri: "/api/environment",
        json: true
      };

      return new Promise<ApiResponse<KuduEnvironment>>((resolve, reject) => {
        request(
          options,
          utils.createPromiseCallback(
            "getting the Kudu environment",
            resolve,
            reject
          )
        );
      });
    }
  };
}
