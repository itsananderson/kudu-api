import * as utils from "./utils";

export interface ExtensionsBase {
  list: (filter, cb) => void;
  get: (id, cb) => void;
}

export interface SiteExtensions extends ExtensionsBase {
  del: (id, cb) => void;
  set: (id, payload, cb) => void;
}

export interface Extensions {
  feed: ExtensionsBase;
  site: SiteExtensions;
}

export default function extensions(request): Extensions {
  function extension(baseUrl): ExtensionsBase {
    return {
      list: function list(filter, cb): void {
        var query = { filter: undefined };

        if (typeof filter === "function") {
          cb = filter;
        } else if (filter) {
          query.filter = filter;
        }

        var options = {
          uri: baseUrl,
          qs: query,
          json: true
        };
        var action = "listing extensions";

        request(options, utils.createCallback(action, cb));
      },

      get: function get(id, cb): void {
        var options = {
          uri: baseUrl + "/" + encodeURIComponent(id),
          json: true
        };
        var action = "getting extension with id " + id;

        request(options, utils.createCallback(action, cb));
      }
    };
  }

  return {
    feed: extension("/api/extensionfeed"),
    site: {
      ...extension("/api/siteextensions"),
      del: function del(id, cb): void {
        var options = {
          uri: "/api/siteextensions/" + encodeURIComponent(id),
          json: true
        };
        var action = "deleting extension with id " + id;

        request.del(options, utils.createCallback(action, cb));
      },
      set: function set(id, payload, cb): void {
        var options = {
          uri: "/api/siteextensions/" + encodeURIComponent(id),
          json: payload
        };
        var action = "installing or updating extension with id " + id;

        request.put(options, utils.createCallback(action, cb));
      }
    }
  };
}
