module.exports = function extensions(request) {
    function extension(baseUrl, includeDelete) {
        return {
            list: function list(filter, cb) {
                if (typeof filter === "function") {
                    cb = filter;
                    filter = null
                }
                url = baseUrl + (filter ? "?filter=" + filter : "");
                request(url, function(err, response, body) {
                    if (err) return cb(err);
                    cb(null, JSON.parse(body), response);
                });
            },
            get: function get(id, cb) {
                request(baseUrl + "/" + id, function(err, response, body) {
                    if (err) return cb(err);
                    cb(null, JSON.parse(body), response);
                });
            }
        };
    }

    var feed = extension("/api/extensionfeed");
    var site = extension("/api/siteextensions");
    site.del = function del(id, cb) {
        request.del("/api/siteextensions/" + id, function(err, response, body) {
            if (err) return cb(err);
            cb(null, JSON.parse(body), response);
        });
    };
    site.set = function set(id, payload, cb) {
        request.put({
            uri: "/api/siteextensions/" + id,
            json: payload
        }, function(err, response, body) {
            if (err) return cb(err);
            cb(null, body, response);
        });
    };
    return {
        feed: feed,
        site: site
    }
};
