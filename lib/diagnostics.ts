import * as utils from "./utils";

export default function diagnostics(request) {
    return {
        list: function list(cb) {
            var options = {
                uri: "/api/diagnostics/settings",
                json: true
            };

            request(options, utils.createCallback("listing diagnostic settings", cb));
        },

        get: function get(key, cb) {
            var options = {
                uri: "/api/diagnostics/settings/" + encodeURIComponent(key),
                json: true
            };
            var action = "getting diagnostic settiing with key " + key;

            request(options, utils.createCallback(action, cb));
        },

        del: function del(key, cb) {
            var url = "/api/diagnostics/settings/" + encodeURIComponent(key);
            var action = "deleting diagnostic settiing with key " + key;

            request.del(url, utils.createCallback(action, cb));
        },

        set: function set(settings, cb) {
            var options = {
                uri: "/api/diagnostics/settings/",
                json: settings
            };
            var action = "setting diagnostic settings";

            request.post(options, utils.createCallback(action, cb));
        }
    };
}
