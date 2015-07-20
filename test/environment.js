var assert = require("assert");
var api = require("../")(process.env.WEBSITE, process.env.USERNAME, process.env.PASSWORD);

describe("environment", function() {
    this.timeout(5000);

    it("can get the environment", function(done) {
        api.environment.get(function(err, environment) {
            if (err) done(err);
            assert.notStrictEqual(environment.version, undefined, "version is defined");
            done();
        });
    });
});
