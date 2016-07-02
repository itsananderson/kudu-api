"use strict";

var assert = require("assert");
var path = require("path");
var api = require("../")({website: process.env.WEBSITE, username: process.env.USERNAME, password: process.env.PASSWORD});

describe("webjobs", function () {
    this.timeout(5000);

    it("can get all webjobs", function (done) {
        api.webjobs.listAll(function (err, data) {
            if (err) {
                return done(err);
            }

            assert.strictEqual(data.length, 0, "Web job list should be empty.");
            done();
        });
    });
});
