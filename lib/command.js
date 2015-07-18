module.exports = function command(request) {
    return {
        exec: function exec(command, dir, cb) {
            request.post({
                uri: "/api/command",
                json: {
                    command: command,
                    dir: dir
                }
            }, function(err, response, body) {
                if (err) return cb(err);
                cb(null, body);
            });
        }
    }
};
