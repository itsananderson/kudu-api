var assert = require("assert");
var api = require("../")({website: process.env.WEBSITE, username: process.env.USERNAME, password: process.env.PASSWORD});

describe("scm", function() {
    this.timeout(5000);

    it("can retrieve info", function(done) {
        api.scm.info(function(err, info) {
            if (err) done(err);
            assert.notEqual(info.Type, undefined, "Type is defined");
            assert.notEqual(info.GitUrl, undefined, "GitUrl is defined");
            done();
        });
    });
    it("can clean repo", function(done) {
        // Not much to test here
        // If successful, returns a 204. If no Git repo exists, returns a 500
        api.scm.clean(done);
    });
    it("can delete repo", function(done) {
        // If successful, default config is still returned, so this is hard to test
        api.scm.del(done);
    });
});
