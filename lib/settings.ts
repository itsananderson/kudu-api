import * as utils from "./utils";

export interface Settings {
    list: (cb) => void;
    get: (key, cb) => void;
    del: (key, cb) => void;
    set: (settings, cb) => void;
}

export default function settings(request): Settings {
    return {
        list: function list(cb): void {
            var options = {
                uri: "/api/settings",
                json: true
            };

            request(options, utils.createCallback("listing settings", cb));
        },

        get: function get(key, cb): void {
            var options = {
                uri: "/api/settings/" + encodeURIComponent(key),
                json: true
            };
            var action = "getting setting with key " + key;

            request(options, utils.createCallback(action, cb));
        },

        del: function del(key, cb): void {
            var url = "/api/settings/" + encodeURIComponent(key);
            var action = "deleting setting with key " + key;

            request.del(url, utils.createCallback(action, cb));
        },

        set: function set(settings, cb): void {
            var options = {
                uri: "/api/settings/",
                json: settings
            };
            var action = "updating settings";

            request.post(options, utils.createCallback(action, cb));
        }
    };
}
