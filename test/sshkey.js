var path = require("path");
var api = require("../")(process.env.WEBSITE, process.env.USERNAME, process.env.PASSWORD);

describe("sshkey", function() {
    this.timeout(5000);

    it("can generate a new key if none exists", function(done) {
        api.sshkey.get(true, done);
    });

    it("can download key", function(done) {
        api.sshkey.get(done);
    });
});
