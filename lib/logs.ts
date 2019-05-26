import * as utils from "./utils";

interface Logs {
  recent: (query, cb) => void;
}

export default function logs(request): Logs {
  return {
    recent: function recent(query, cb): void {
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
