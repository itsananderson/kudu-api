"use strict";

var assert = require("assert");
var testUtils = require("./test-utils");
var api;

describe("environment", function() {
    this.timeout(5000);

    describe("with standard credentials", function () {
        before(testUtils.setupKudu(function (kuduApi) {
            api = kuduApi;
        }));

        it("can get the environment", function(done) {
            api.environment.get(function(err, result) {
                if (err) {
                    return done(err);
                }

                assert.notStrictEqual(result.data.version, undefined, "version is defined");
                done();
            });
        });
    });

    describe("with basic credentials", function() {
        before(testUtils.setupKudu(true, function (kuduApi) {
            api = kuduApi;
        }));

        it("can get the environment", function(done) {
            api.environment.get(function(err, result) {
                if (err) {
                    return done(err);
                }

                assert.notStrictEqual(result.data.version, undefined, "version is defined");
                done();
            });
        });
    });
});
