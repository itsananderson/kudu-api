var assert = require("assert");
var path = require("path");
var api = require("../")(process.env.WEBSITE, process.env.USERNAME, process.env.PASSWORD);

describe("sshkey", function() {
    this.timeout(5000);

    it("can generate a new key if none exists", function(done) {
        api.sshkey.get(true, function(err, key) {
            assert(/^ssh-rsa/.test(key), "Should be a valid key");
            done(err);
        });
    });

    it("can download key", function(done) {
        api.sshkey.get(function(err, key) {
            assert(/^ssh-rsa/.test(key), "Should be a valid key");
            done(err);
        });
    });
});
