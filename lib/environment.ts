import * as utils from "./utils";

export interface Environment {
    get: (cb) => void;
}

export default function environment(request): Environment {
    return {
        get: function get(cb): void {
            var options = {
                uri: "/api/environment",
                json: true
            };

            request(options, utils.createCallback("getting the Kudu environment", cb));
        }
    };
}
