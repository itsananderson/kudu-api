import * as utils from "./utils";
import { ApiResponse } from "./types";
import { RequestAPI, Request, CoreOptions, RequiredUriUrl } from "request";

export type DiagnosticSettings = {
  [key: string]: string | boolean;
};

export interface DiagnosticsApi {
  list: () => Promise<ApiResponse<DiagnosticSettings>>;
  get: (key: string) => Promise<ApiResponse<string>>;
  del: (key: string) => Promise<ApiResponse<void>>;
  set: (settings: DiagnosticSettings) => Promise<ApiResponse<void>>;
}

export default function diagnostics(
  request: RequestAPI<Request, CoreOptions, RequiredUriUrl>
): DiagnosticsApi {
  return {
    list: function list(): Promise<ApiResponse<DiagnosticSettings>> {
      const options = {
        uri: "/api/diagnostics/settings",
        json: true,
      };

      return new Promise<ApiResponse<DiagnosticSettings>>((resolve, reject) => {
        request(
          options,
          utils.createPromiseCallback(
            "listing diagnostic settings",
            resolve,
            reject
          )
        );
      });
    },

    get: function get(key: string): Promise<ApiResponse<string>> {
      const options = {
        uri: "/api/diagnostics/settings/" + encodeURIComponent(key),
        json: true,
      };

      return new Promise<ApiResponse<string>>((resolve, reject) => {
        request(
          options,
          utils.createPromiseCallback(
            "getting diagnostic settiing with key " + key,
            resolve,
            reject
          )
        );
      });
    },

    del: function del(key): Promise<ApiResponse<void>> {
      const url = "/api/diagnostics/settings/" + encodeURIComponent(key);
      const action = "deleting diagnostic settiing with key " + key;

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.del(url, utils.createPromiseCallback(action, resolve, reject));
      });
    },

    set: function set(settings): Promise<ApiResponse<void>> {
      const options = {
        uri: "/api/diagnostics/settings/",
        json: settings,
      };
      const action = "setting diagnostic settings";

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.post(
          options,
          utils.createPromiseCallback(action, resolve, reject)
        );
      });
    },
  };
}
