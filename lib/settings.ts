import * as utils from "./utils";
import { RequestAPI, Request, CoreOptions, RequiredUriUrl } from "request";
import { ApiResponse } from "./types";

export interface Settings {
  list: () => Promise<ApiResponse<{ [key: string]: string }>>;
  get: (key: string) => Promise<ApiResponse<string>>;
  del: (key: string) => Promise<ApiResponse<void>>;
  set: (settings: { [key: string]: string }) => Promise<ApiResponse<void>>;
}

export default function settings(
  request: RequestAPI<Request, CoreOptions, RequiredUriUrl>
): Settings {
  return {
    list: function list(): Promise<ApiResponse<{ [key: string]: string }>> {
      const options = {
        uri: "/api/settings",
        json: true,
      };

      return new Promise<ApiResponse<{ [key: string]: string }>>(
        (resolve, reject) => {
          request(
            options,
            utils.createPromiseCallback("listing settings", resolve, reject)
          );
        }
      );
    },

    get: function get(key: string): Promise<ApiResponse<string>> {
      const options = {
        uri: "/api/settings/" + encodeURIComponent(key),
        json: true,
      };
      const action = "getting setting with key " + key;

      return new Promise<ApiResponse<string>>((resolve, reject) => {
        request(options, utils.createPromiseCallback(action, resolve, reject));
      });
    },

    del: function del(key: string): Promise<ApiResponse<void>> {
      const url = "/api/settings/" + encodeURIComponent(key);
      const action = "deleting setting with key " + key;

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.del(url, utils.createPromiseCallback(action, resolve, reject));
      });
    },

    set: function set(settings: {
      [key: string]: string;
    }): Promise<ApiResponse<void>> {
      const options = {
        uri: "/api/settings/",
        json: settings,
      };
      const action = "updating settings";

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.post(
          options,
          utils.createPromiseCallback(action, resolve, reject)
        );
      });
    },
  };
}
