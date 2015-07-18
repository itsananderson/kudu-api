var fs = require("fs");

module.exports = function zip(request) {
    return {
        download: function download(fromPath, toPath, cb) {
            request("/api/zip/" + fromPath, function(err, response) {
                if (err) return cb(err);
                cb();
            }).pipe(fs.createWriteStream(toPath));
        },
        upload: function upload(fromPath, toPath, cb) {
            fs.createReadStream(fromPath).pipe(request.put({
                uri: "/api/zip/" + toPath,
            }, function(err, response, body) {
                if (err) return cb(err);
                cb(null, body);
            }));
        }
    }
};
