import * as utils from "./utils";

export default function environment(request) {
    return {
        get: function get(cb) {
            var options = {
                uri: "/api/environment",
                json: true
            };

            request(options, utils.createCallback("getting the Kudu environment", cb));
        }
    };
}
