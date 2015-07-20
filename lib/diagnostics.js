module.exports = function diagnostics(request) {
    return {
        list: function list(cb) {
            request("/api/diagnostics/settings", function(err, response, body) {
                if (err) return cb(err);
                cb(null, JSON.parse(body), response);
            });
        },
        get: function get(key, cb) {
            request("/api/diagnostics/settings/" + key, function(err, response, body) {
                if (err) return cb(err);
                cb(null, JSON.parse(body), response);
            });
        },
        del: function del(key, cb) {
            request.del("/api/diagnostics/settings/" + key, function(err, response, body) {
                if (err) return cb(err);
                cb(null, body, response);
            });
        },
        set: function set(settings, cb) {
            request.post({
                uri: "/api/diagnostics/settings/",
                json: settings
            }, function(err, response, body) {
                if (err) return cb(err);
                cb(null, body, response);
            });
        }
    }
};
