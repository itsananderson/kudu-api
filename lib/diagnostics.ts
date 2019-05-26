import * as utils from "./utils";

export interface Diagnostics {
  list: (cb) => void;
  get: (key, cb) => void;
  del: (key, cb) => void;
  set: (settings, cb) => void;
}

export default function diagnostics(request): Diagnostics {
  return {
    list: function list(cb): void {
      var options = {
        uri: "/api/diagnostics/settings",
        json: true
      };

      request(options, utils.createCallback("listing diagnostic settings", cb));
    },

    get: function get(key, cb): void {
      var options = {
        uri: "/api/diagnostics/settings/" + encodeURIComponent(key),
        json: true
      };
      var action = "getting diagnostic settiing with key " + key;

      request(options, utils.createCallback(action, cb));
    },

    del: function del(key, cb): void {
      var url = "/api/diagnostics/settings/" + encodeURIComponent(key);
      var action = "deleting diagnostic settiing with key " + key;

      request.del(url, utils.createCallback(action, cb));
    },

    set: function set(settings, cb): void {
      var options = {
        uri: "/api/diagnostics/settings/",
        json: settings
      };
      var action = "setting diagnostic settings";

      request.post(options, utils.createCallback(action, cb));
    }
  };
}
