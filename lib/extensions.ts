import * as utils from "./utils";
import { ApiResponse } from "./types";
import { RequestAPI, Request, CoreOptions, RequiredUriUrl } from "request";

export interface Extension {
  id: string;
}

export interface SetExtensionResult {
  provisioningState: string;
}

export interface ExtensionsBase {
  list: (filter?: string) => Promise<ApiResponse<Extension[]>>;
  get: (id: string) => Promise<ApiResponse<Extension>>;
}

export interface SiteExtensions extends ExtensionsBase {
  del: (id: string) => Promise<ApiResponse<void>>;
  set: (
    id: string,
    payload: Extension
  ) => Promise<ApiResponse<SetExtensionResult>>;
}

export interface ExtensionsApi {
  feed: ExtensionsBase;
  site: SiteExtensions;
}

export default function extensions(
  request: RequestAPI<Request, CoreOptions, RequiredUriUrl>
): ExtensionsApi {
  function extension(baseUrl: string): ExtensionsBase {
    return {
      list: function list(
        filter: string = undefined
      ): Promise<ApiResponse<Extension[]>> {
        const query = { filter };

        const options = {
          uri: baseUrl,
          qs: query,
          json: true,
        };
        const action = "listing extensions";

        return new Promise<ApiResponse<Extension[]>>((resolve, reject) => {
          request(
            options,
            utils.createPromiseCallback(action, resolve, reject)
          );
        });
      },

      get: function get(id: string): Promise<ApiResponse<Extension>> {
        const options = {
          uri: baseUrl + "/" + encodeURIComponent(id),
          json: true,
        };
        const action = "getting extension with id " + id;

        return new Promise<ApiResponse<Extension>>((resolve, reject) => {
          request(
            options,
            utils.createPromiseCallback(action, resolve, reject)
          );
        });
      },
    };
  }

  return {
    feed: extension("/api/extensionfeed"),
    site: {
      ...extension("/api/siteextensions"),
      del: function del(id: string): Promise<ApiResponse<void>> {
        const options = {
          uri: "/api/siteextensions/" + encodeURIComponent(id),
          json: true,
        };
        const action = "deleting extension with id " + id;

        return new Promise<ApiResponse<void>>((resolve, reject) => {
          request.del(
            options,
            utils.createPromiseCallback(action, resolve, reject)
          );
        });
      },
      set: function set(
        id: string,
        payload: Extension
      ): Promise<ApiResponse<SetExtensionResult>> {
        const options = {
          uri: "/api/siteextensions/" + encodeURIComponent(id),
          json: payload,
        };
        const action = "installing or updating extension with id " + id;

        return new Promise<ApiResponse<SetExtensionResult>>(
          (resolve, reject) => {
            request.put(
              options,
              utils.createPromiseCallback(action, resolve, reject)
            );
          }
        );
      },
    },
  };
}
