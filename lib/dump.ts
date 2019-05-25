import * as fs from "fs";
import * as utils from "./utils";

export interface Dump {
    download: (dest, cb) => void;
}

export default function dump(request): Dump {
    return {
        download: function download(dest, cb): void {
            request("/api/dump", utils.createCallback("dumping diagnostic logs", cb))
                .pipe(fs.createWriteStream(dest));
        }
    };
}
