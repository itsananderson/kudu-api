module.exports = function command(request) {
    return {
        recent: function exec(query, cb) {
            if (typeof query === "function") {
                cb = query;
                query = {}
            }
            request({
                uri: "/api/logs/recent",
                qs: query
            }, function(err, response, body) {
                if (err) return cb(err);
                cb(null, JSON.parse(body));
            });
        }
    }
};
