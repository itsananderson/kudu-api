import * as fs from "fs";

import * as utils from "./utils";

function ensureTrailingSlash(path): void {
  if ("/" !== path[path.length - 1]) {
    path += "/";
  }

  return path;
}

export interface VFS {
  getFile: (path, cb) => void;
  listFiles: (path, cb) => void;
  uploadFile: (localPath, destPath, etag, cb) => void;
  createDirectory: (path, cb) => void;
  deleteFile: (path, etag, cb) => void;
  deleteDirectory: (path, cb) => void;
}

export default function vfs(request): VFS {
  return {
    getFile: function getFile(path, cb): void {
      var url = "/api/vfs/" + path;
      var action = "getting file with path " + path;

      request(url, utils.createCallback(action, cb));
    },

    listFiles: function listFiles(path, cb): void {
      path = ensureTrailingSlash(path);

      var options = {
        uri: "/api/vfs/" + path,
        json: true
      };
      var action = "listing files with path " + path;

      request(options, utils.createCallback(action, cb));
    },

    uploadFile: function uploadFile(localPath, destPath, etag, cb): void {
      if (typeof etag === "function") {
        cb = etag;
        etag = "*";
      }

      var options = {
        uri: "/api/vfs/" + destPath,
        headers: {
          "If-Match": etag
        }
      };
      var action = "uploading file to destination " + destPath;

      fs.createReadStream(localPath).pipe(
        request.put(options, utils.createCallback(action, cb))
      );
    },

    createDirectory: function createDirectory(path, cb): void {
      path = ensureTrailingSlash(path);

      var url = "/api/vfs/" + path;
      var action = "creating directory with path " + path;

      request.put(url, utils.createCallback(action, cb));
    },

    deleteFile: function deleteFile(path, etag, cb): void {
      if (typeof etag === "function") {
        cb = etag;
        etag = "*";
      }

      var options = {
        uri: "/api/vfs/" + path,
        headers: {
          "If-Match": etag
        }
      };
      var action = "deleting file with path " + path;

      request.del(options, utils.createCallback(action, cb));
    },

    deleteDirectory: function deleteDirectory(path, cb): void {
      path = ensureTrailingSlash(path);

      var url = "/api/vfs/" + path;
      var action = "deleting directory with path " + path;

      request.del(url, utils.createCallback(action, cb));
    }
  };
}
