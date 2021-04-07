import * as fs from "fs";
import * as utils from "./utils";
import { ApiResponse } from "./types";
import {
  RequestAPI,
  Request,
  Response,
  CoreOptions,
  RequiredUriUrl,
} from "request";

interface Zip {
  download: (fromPath: string, toPath: string) => Promise<ApiResponse<void>>;
  upload: (fromPath: string, toPath: string) => Promise<ApiResponse<void>>;
}

export default function zip(
  request: RequestAPI<Request, CoreOptions, RequiredUriUrl>
): Zip {
  return {
    download: function download(
      fromPath: string,
      toPath: string
    ): Promise<ApiResponse<void>> {
      const url = "/api/zip/" + fromPath;
      const action = "downloading zip file from " + fromPath;

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        const callbackWrapper = utils.createPromiseCallback(
          action,
          resolve,
          reject
        );
        let response: Response;
        request(url)
          .on("response", function (res): void {
            response = res;
          })
          .on("error", function (err): void {
            callbackWrapper(err, response);
          })
          .pipe(fs.createWriteStream(toPath))
          .on("close", function (): void {
            callbackWrapper(null, response);
          });
      });
    },

    upload: function upload(
      fromPath: string,
      toPath: string
    ): Promise<ApiResponse<void>> {
      const url = "/api/zip/" + toPath;
      const action = "uploading zip file to " + toPath;

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        fs.createReadStream(fromPath).pipe(
          request.put(url, utils.createPromiseCallback(action, resolve, reject))
        );
      });
    },
  };
}
