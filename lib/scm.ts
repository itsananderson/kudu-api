import * as utils from "./utils";

export interface SCM {
  info: (cb) => void;
  clean: (cb) => void;
  del: (cb) => void;
}

export default function scm(request): SCM {
  return {
    info: function info(cb): void {
      var options = {
        uri: "/api/scm/info",
        json: true
      };

      request(
        options,
        utils.createCallback("getting information about the repository", cb)
      );
    },

    clean: function clean(cb): void {
      request.post(
        "/api/scm/clean",
        utils.createCallback("cleaning the repository", cb)
      );
    },

    del: function del(cb): void {
      request.del(
        "/api/scm",
        utils.createCallback("deleting the repository", cb)
      );
    }
  };
}
