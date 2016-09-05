var assert = require("assert");
var basicCredentials = new Buffer(process.env.USERNAME + ":" + process.env.PASSWORD).toString("base64");
var api = require("../")({ website: process.env.WEBSITE, basic: basicCredentials });

describe("environment", function() {
    this.timeout(5000);

    it("can get the environment", function(done) {
        api.environment.get(function(err, environment) {
            if (err) {
                done(err);
            }

            assert.notStrictEqual(environment.version, undefined, "version is defined");
            done();
        });
    });
});
