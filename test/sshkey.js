var path = require("path");
var api = require("../")(process.env.WEBSITE, process.env.USERNAME, process.env.PASSWORD);

describe("sshkey", function() {
    this.timeout(5000);

    beforeEach(function(done) {
        api.sshkey.upload(path.join(__dirname, "key.pem"), done);
    });

    it("can upload key", function(done) {
        api.sshkey.upload(path.join(__dirname, "key.pem"), done);
    });
    it("can download key", function(done) {
        api.sshkey.get(done);
    });
    it("can generate a new key", function(done) {
        api.sshkey.get(true, done);
    });
});
