import * as fs from "fs";
import * as utils from "./utils";
import { ApiResponse } from "./types";
import { Response } from "request";

export interface Dump {
  download: (dest: string) => Promise<ApiResponse<void>>;
}

export default function dump(request): Dump {
  return {
    download: function download(dest): Promise<ApiResponse<void>> {
      return new Promise<ApiResponse<void>>((resolve, reject) => {
        var callbackWrapper = utils.createPromiseCallback(
          "dumping diagnostic logs",
          resolve,
          reject
        );

        let response: Response;
        request("/api/dump")
          .on("response", function(res: Response): void {
            response = res;
          })
          .on("error", function(err: Error): void {
            callbackWrapper(err, response);
          })
          .pipe(fs.createWriteStream(dest))
          .on("close", function(): void {
            callbackWrapper(null, response);
          });
      });
    }
  };
}
