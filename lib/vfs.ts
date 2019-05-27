import * as fs from "fs";

import { RequestAPI, Request, CoreOptions, RequiredUriUrl } from "request";

import * as utils from "./utils";
import { ApiResponse } from "./types";

function ensureTrailingSlash(path): string {
  if ("/" !== path[path.length - 1]) {
    path += "/";
  }

  return path;
}

export interface VfsApi {
  getFile: (path: string) => Promise<ApiResponse<string>>;
  listFiles: (path: string) => Promise<ApiResponse<string[]>>;
  uploadFile: (
    localPath: string,
    destPath: string,
    etag?: string
  ) => Promise<ApiResponse<void>>;
  createDirectory: (path: string) => Promise<ApiResponse<void>>;
  deleteFile: (path: string, etag?: string) => Promise<ApiResponse<void>>;
  deleteDirectory: (path: string) => Promise<ApiResponse<void>>;
}

export default function vfs(
  request: RequestAPI<Request, CoreOptions, RequiredUriUrl>
): VfsApi {
  return {
    getFile: function getFile(path: string): Promise<ApiResponse<string>> {
      var url = "/api/vfs/" + path;
      var action = "getting file with path " + path;

      return new Promise<ApiResponse<string>>((resolve, reject) => {
        request(url, utils.createPromiseCallback(action, resolve, reject));
      });
    },

    listFiles: function listFiles(
      path: string
    ): Promise<ApiResponse<string[]>> {
      path = ensureTrailingSlash(path);

      var options = {
        uri: "/api/vfs/" + path,
        json: true
      };
      var action = "listing files with path " + path;

      return new Promise<ApiResponse<string[]>>((resolve, reject) => {
        request(options, utils.createPromiseCallback(action, resolve, reject));
      });
    },

    uploadFile: function uploadFile(
      localPath: string,
      destPath: string,
      etag: string = "*"
    ): Promise<ApiResponse<void>> {
      var options = {
        uri: "/api/vfs/" + destPath,
        headers: {
          "If-Match": etag
        }
      };
      var action = "uploading file to destination " + destPath;

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        fs.createReadStream(localPath).pipe(
          request.put(
            options,
            utils.createPromiseCallback(action, resolve, reject)
          )
        );
      });
    },

    createDirectory: function createDirectory(
      path: string
    ): Promise<ApiResponse<void>> {
      path = ensureTrailingSlash(path);

      var url = "/api/vfs/" + path;
      var action = "creating directory with path " + path;

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.put(url, utils.createPromiseCallback(action, resolve, reject));
      });
    },

    deleteFile: function deleteFile(
      path: string,
      etag: string = "*"
    ): Promise<ApiResponse<void>> {
      var options = {
        uri: "/api/vfs/" + path,
        headers: {
          "If-Match": etag
        }
      };
      var action = "deleting file with path " + path;

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.del(
          options,
          utils.createPromiseCallback(action, resolve, reject)
        );
      });
    },

    deleteDirectory: function deleteDirectory(
      path: string
    ): Promise<ApiResponse<void>> {
      path = ensureTrailingSlash(path);

      var url = "/api/vfs/" + path;
      var action = "deleting directory with path " + path;

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.del(url, utils.createPromiseCallback(action, resolve, reject));
      });
    }
  };
}
