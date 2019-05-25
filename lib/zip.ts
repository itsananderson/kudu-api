import * as fs from "fs";
import * as utils from "./utils";

interface Zip {
    download: (fromPath, toPath, cb) => void;
    upload: (fromPath, toPath, cb) => void;
}

export default function zip(request): Zip {
    return {
        download: function download(fromPath, toPath, cb): void {
            var url = "/api/zip/" + fromPath;
            var action = "downloading zip file from " + fromPath;

            var callbackWrapper = utils.createCallback(action, cb);

            var response;
            request(url)
                .on("response", function(res): void {
                    response = res;
                })
                .on("error", function(err): void {
                    callbackWrapper(err, response);
                })
                .pipe(fs.createWriteStream(toPath))
                .on("close", function (): void {
                    callbackWrapper(null, response);
                });
        },

        upload: function upload(fromPath, toPath, cb): void {
            var url = "/api/zip/" + toPath;
            var action = "uploading zip file to " + toPath;

            fs.createReadStream(fromPath)
                .pipe(request.put(url, utils.createCallback(action, cb)));
        }
    };
}
