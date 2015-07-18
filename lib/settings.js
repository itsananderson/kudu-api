module.exports = function settings(request) {
    return {
        list: function list(cb) {
            request("/api/settings", function(err, response, body) {
                if (err) return cb(err);
                cb(null, JSON.parse(body));
            });
        },
        get: function get(key, cb) {
            request("/api/settings/" + key, function(err, response, body) {
                if (err) return cb(err);
                cb(null, JSON.parse(body));
            });
        },
        del: function del(key, cb) {
            request.del("/api/settings/" + key, function(err, response, body) {
                if (err) return cb(err);
                cb(null, body);
            });
        },
        set: function set(settings, cb) {
            request.post({
                uri: "/api/settings/",
                json: settings
            }, function(err, response, body) {
                if (err) return cb(err);
                cb(null, body);
            });
        }
    }
};
