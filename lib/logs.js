module.exports = function command(request) {
    return {
        recent: function recent(query, cb) {
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
