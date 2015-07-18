var api = require("../")(process.env.WEBSITE, process.env.USERNAME, process.env.PASSWORD);

describe("command", function() {
    this.timeout(5000);

    it("can retrieve recent logs", function(done) {
        api.logs.recent(function() {
            done();
        });
    });

    it("can retrieve custom number of recent logs", function(done) {
        api.logs.recent(500, function() {
            done();
        });
    });
});
