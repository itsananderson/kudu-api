var fs = require("fs");

module.exports = function sshkey(request) {
    return {
        upload: function upload(pemPath, cb) {
            fs.createReadStream(pemPath).pipe(request.put("/api/sshkey", function(err, response, body) {
                if (err) return cb(err);
                cb(null, body);
            }));
        },
        get: function get(generate, cb) {
            if (typeof generate === "function") {
                cb = generate;
                generate = false;
            }

            var url = "/api/sshkey/" + (generate ? "?ensurePublicKey=1" : "")
            request(url, function(err, response, body) {
                if (err) return cb(err);
                cb(null, JSON.parse(body));
            });
        }
    }
};
