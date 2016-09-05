var assert = require("assert");
var api = require("../")({website: process.env.WEBSITE, username: process.env.USERNAME, password: process.env.PASSWORD});

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
