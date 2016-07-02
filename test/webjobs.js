"use strict";

var assert = require("assert");
var api = require("../")({website: process.env.WEBSITE, username: process.env.USERNAME, password: process.env.PASSWORD});

describe("webjobs", function () {
    this.timeout(5000);

    it("can list all webjobs", function (done) {
        api.webjobs.listAll(function (err, data) {
            if (err) {
                return done(err);
            }

            assert.strictEqual(data.length, 0, "Web job list should be empty.");
            done();
        });
    });

    it("can list triggered webjobs", function (done) {
        api.webjobs.listTriggered(function (err, data) {
            if (err) {
                return done(err);
            }

            assert.strictEqual(data.length, 0, "Triggered job list should be empty.");
            done();
        });
    });

    it("can list triggered webjobs as swagger", function (done) {
        api.webjobs.listTriggeredAsSwagger(function (err, data) {
            if (err) {
                return done(err);
            }

            assert.strictEqual(data.swagger, "2.0", "Triggered job list as swagger should have expected version.");
            done();
        });
    });

    it("should report error getting unknown triggered webjob", function (done) {
        api.webjobs.getTriggered("triggered-job", function (err) {
            if (err) {
                var statusPattern = /404\ \(Not\ Found\)/;
                assert(statusPattern.test(err.message), "Unknown triggered job error should contain status code.");

                return done();
            }

            done(new Error("Expected error was not thrown."));
        });
    });
});
