import * as fs from "fs";
import * as utils from "./utils";

export default function dump(request) {
    return {
        download: function download(dest, cb) {
            request("/api/dump", utils.createCallback("dumping diagnostic logs", cb))
                .pipe(fs.createWriteStream(dest));
        }
    };
}
