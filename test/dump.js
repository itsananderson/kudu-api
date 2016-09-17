"use strict";

var assert = require("assert");
var fs = require("fs");
var path = require("path");
var api = require("../")({website: process.env.WEBSITE, username: process.env.USERNAME, password: process.env.PASSWORD});

describe("dump", function() {
    this.timeout(30 * 1000);

    it("can retrieve dump", function(done) {
        var dest = path.join(__dirname, "test.zip");
        if (fs.existsSync(dest)) {
            fs.unlinkSync(dest);
        }
        api.dump.download(dest, function(err) {
            if (err) {
                return done(err);
            }

            assert(fs.existsSync(dest), "Downloaded dump file exists");
            done();
        });
    });
});
