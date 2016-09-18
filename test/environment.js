"use strict";

var assert = require("assert");
var testUtils = require("./test-utils");
var api;

describe("environment", function() {
    this.timeout(5000);

    before(testUtils.setupKudu(function (kuduApi) {
        api = kuduApi;
    }));

    it("can get the environment", function(done) {
        api.environment.get(function(err, environment) {
            if (err) {
                return done(err);
            }

            assert.notStrictEqual(environment.version, undefined, "version is defined");
            done();
        });
    });
});
