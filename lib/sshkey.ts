import * as utils from "./utils";

interface SshKey {
  get: (generate, cb) => void;
}

export default function sshkey(request): SshKey {
  return {
    get: function get(generate, cb): void {
      var query = { ensurePublicKey: undefined };

      if (typeof generate === "function") {
        cb = generate;
      } else if (generate) {
        query.ensurePublicKey = 1;
      }

      var options = {
        uri: "/api/sshkey/",
        qs: query,
        json: true
      };
      var action = "getting SSH key";

      request(options, utils.createCallback(action, cb));
    }
  };
}
