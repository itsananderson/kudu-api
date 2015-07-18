module.exports = function deployment(request) {
    return {
        list: function list(cb) {
            request("/api/deployments/", function(err, response, body) {
                if (err) return cb(err);
                cb(null, JSON.parse(body));
            });
        },
        get: function get(id, cb) {
            request("/api/deployments/" + id, function(err, response, body) {
                if (err) return cb(err);
                cb(null, JSON.parse(body));
            });
        },
        del: function del(id, cb) {
            request.del("/api/deployments/" + id, function(err, response, body) {
                if (err) return cb(err);
                cb(null, body);
            });
        },
        log: function log(id, cb) {
            request("/api/deployments/" + id + "/log", function(err, response, body) {
                if (err) return cb(err);
                cb(null, JSON.parse(body));
            });
        },
        logDetails: function logDetails(id, entryId, cb) {
            request("/api/deployments/" + id + "/log/" + entryId, function(err, response, body) {
                if (err) return cb(err);
                cb(null, JSON.parse(body));
            });
        },
        deploy: function deploy(repoUrl, cb) {
            request.post({
                uri: "/deploy/",
                json: {
                    format: "basic",
                    url: repoUrl
                }
            }, function(err, response, body) {
                if (err) return cb(err);
                cb(null, body);
            });
        },
        redeploy: function redeploy(id, cb) {
            request.put("/api/deployments/" + id, function(err, response, body) {
                if (err) return cb(err);
                cb(null, body);
            });
        }
    }
};
