import * as utils from "./utils";
import { RequestAPI, Request, CoreOptions, RequiredUriUrl } from "request";
import { ApiResponse } from "./types";

export interface ScmApi {
  info: () => Promise<ApiResponse<ScmInfo>>;
  clean: () => Promise<ApiResponse<void>>;
  del: () => Promise<ApiResponse<void>>;
}

export interface ScmInfo {
  Type: string;
  GitUrl: string;
}

export default function scm(
  request: RequestAPI<Request, CoreOptions, RequiredUriUrl>
): ScmApi {
  return {
    info: function info(): Promise<ApiResponse<ScmInfo>> {
      const options = {
        uri: "/api/scm/info",
        json: true,
      };

      const action = "getting information about the repository";
      return new Promise<ApiResponse<ScmInfo>>((resolve, reject) => {
        request(options, utils.createPromiseCallback(action, resolve, reject));
      });
    },

    clean: function clean(): Promise<ApiResponse<void>> {
      const action = "cleaning the repository";
      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.post(
          "/api/scm/clean",
          utils.createPromiseCallback(action, resolve, reject)
        );
      });
    },

    del: function del(): Promise<ApiResponse<void>> {
      const action = "deleting the repository";
      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.del(
          "/api/scm",
          utils.createPromiseCallback(action, resolve, reject)
        );
      });
    },
  };
}
