"use strict";

var assert = require("assert");
var testUtils = require("./test-utils");
var api;

describe("scm", function () {
    this.timeout(5000);

    before(testUtils.setupKudu(function (kuduApi) {
        api = kuduApi;
    }));

    it("can retrieve info", function (done) {
        api.scm.info(function (err, info) {
            if (err) {
                done(err);
            }

            assert.notEqual(info.Type, undefined, "Type is defined");
            assert.notEqual(info.GitUrl, undefined, "GitUrl is defined");
            done();
        });
    });

    it("can clean repo", function (done) {
        // Not much to test here
        // If successful, returns a 204. If no Git repo exists, returns a 500
        api.scm.clean(function (err, response) {
            if (err) {
                assert.strictEqual(err.response.statusCode, 500, "Should return 500 error if no Git repo exists");
                return done();
            }

            assert.strictEqual(response.statusCode, 204, "Should return 204 response if successful");
            done();
        });
    });

    it("can delete repo", function (done) {
        // If successful, default config is still returned, so this is hard to test
        api.scm.del(done);
    });
});
