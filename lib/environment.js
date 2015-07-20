module.exports = function environment(request) {
    return {
        get: function get(cb) {
            request({
                uri: "/api/environment",
            }, function(err, response, body) {
                if (err) return cb(err);
                cb(null, JSON.parse(body), response);
            });
        }
    }
};
