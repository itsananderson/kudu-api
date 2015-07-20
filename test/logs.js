var assert = require("assert");
var api = require("../")(process.env.WEBSITE, process.env.USERNAME, process.env.PASSWORD);

describe("logs", function() {
    this.timeout(5000);

    it("can retrieve recent logs", function(done) {
        api.logs.recent(function(err, logs) {
            if (err) done(err);
            
            assert(Array.isArray(logs), "logs should be an array");
            done();
        });
    });

    it("can retrieve custom number of recent logs", function(done) {
        api.logs.recent(500, function(err, logs) {
            if (err) done(err);
            assert(Array.isArray(logs), "logs should be an array");
            done();
        });
    });
});
