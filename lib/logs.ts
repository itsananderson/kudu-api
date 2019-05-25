import * as utils from "./utils";

export default function logs(request) {
    return {
        recent: function recent(query, cb) {
            if (typeof query === "function") {
                cb = query;
                query = {};
            }

            var options = {
                uri: "/api/logs/recent",
                qs: query,
                json: true
            };
            var action = "retrieving application logs";

            request(options, utils.createCallback(action, cb));
        }
    };
}
