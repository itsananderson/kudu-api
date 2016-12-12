"use strict";

var assert = require("assert");
var fs = require("fs");
var testUtils = require("./test-utils");
var api;

var localZipPath = testUtils.artifactPath("test.zip");

function deleteLocalZip(done) {
    fs.unlink(localZipPath, function () {
        // Ignore errors
        done();
    });
}

describe("zip", function () {
    this.timeout(5000);

    before(testUtils.setupKudu(function (kuduApi) {
        api = kuduApi;
    }));

    before(testUtils.ensureArtifacts);

    beforeEach(deleteLocalZip);

    afterEach(deleteLocalZip);

    it("can upload a zip", function (done) {
        var localZipContents = {
            "test.txt": "test\n"
        };

        testUtils.createZipFile(localZipPath, localZipContents, function (err) {
            if (err) {
                return done(err);
            }

            api.zip.upload(localZipPath, "site/wwwroot", done);
        });
    });

    it("should return a server error uploading to a folder with illegal characters", function (done) {
        var localZipContents = {
            "test.txt": "test\n"
        };

        testUtils.createZipFileAsync(localZipPath, localZipContents)
            .then(function () {
                return api.zip.uploadAsync(localZipPath, "site/wwwroot/illegal-character\"");
            })
            .then(function () {
                throw new Error("Upload with illegal characters in path should not succeed.");
            })
            .catch(function (err) {
                if (!err.response) {
                    throw err;
                }

                assert.strictEqual(err.response.statusCode, 500, "Error status code should be 500.");
                done();
            })
            .catch(done);
    });

    it("can download a folder as a zip", function (done) {
        this.timeout(30 * 1000);

        fs.exists(localZipPath, function (exists) {
            assert(!exists, "Local zip should not exist before download");

            api.zip.download("site/wwwroot", localZipPath, function (err) {
                if (err) {
                    return done(err);
                }

                fs.exists(localZipPath, function (exists) {
                    assert(exists, "Local zip should exist after download");

                    done();
                });
            });
        });
    });

    it("should return a not found error downloading a non-existent folder", function (done) {
        api.zip.download("site/wwwroot/does-not-exist", localZipPath, function (err) {
            assert(err, "Error should exist.");
            assert.strictEqual(err.response.statusCode, 404, "Error status code should be 404.");
            done();
        });
    });
});
