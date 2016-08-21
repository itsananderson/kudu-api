"use strict";

var assert = require("assert");
var fs = require("fs");
var path = require("path");
var testUtils = require("./test-utils");
var api;

var localZipPath = path.join("test", "artifacts", "test.zip");

describe("zip", function () {
    this.timeout(5000);

    before(testUtils.setupKudu(function (kuduApi) {
        api = kuduApi;
    }));

    before(testUtils.ensureArtifacts);

    it("can upload a zip", function (done) {
        fs.unlink(localZipPath, function () {
            var localZipContents = {
                "test.txt": "test\n"
            };

            testUtils.createZipFile(localZipPath, localZipContents, function (err) {
                if (err) {
                    done(err);
                }

                api.zip.upload(localZipPath, "site/wwwroot", done);
            });
        });
    });

    it("can download a folder as a zip", function (done) {
        this.timeout(30 * 1000);

        fs.unlink(localZipPath, function () {
            fs.exists(localZipPath, function (exists) {
                assert(!exists, "Local zip should not exist before download");

                api.zip.download("site/wwwroot", localZipPath, function (err) {
                    if (err) {
                        done(err);
                    }

                    fs.exists(localZipPath, function (exists) {
                        assert(exists, "Local zip should exist after download");

                        done();
                    });
                });
            });
        });
    });
});
