module.exports = function scm(request) {
    return {
        info: function info(cb) {
            request("/api/scm/info", function(err, response, body) {
                if (err) return cb(err);
                cb(null, JSON.parse(body), response);
            });
        },
        clean: function clean(cb) {
            request.post("/api/scm/clean", function(err, response, body) {
                if (err) return cb(err);
                cb(null, body, response);
            });
        },
        del: function del(cb) {
            request.del("/api/scm", function(err, response, body) {
                cb(err, response);
            });
        }
    }
};
