"use strict";

var assert = require("assert");
var testUtils = require("./test-utils");
var fs = require("fs");
var api;

describe("vfs", function () {
    this.timeout(5000);

    var localPath = "test/artifacts/test1.txt";

    before(testUtils.setupKudu(function (kuduApi) {
        api = kuduApi;
    }));

    before(testUtils.ensureArtifacts);

    before(function (done) {
        fs.writeFile(localPath, "test\n", done);
    });

    before(function (done) {
        api.vfs.uploadFile(localPath, "site/wwwroot/test.txt", done);
    });

    after(function (done) {
        fs.unlink(localPath, function () {
            // Ignore errors
            done();
        });
    });

    it("can get a file", function (done) {
        api.vfs.getFile("site/wwwroot/test.txt", function (err, content) {
            if (err) {
                done(err);
            }

            assert.equal(content.trim(), "test", "Trimmed file content should be 'test'");
            done();
        });
    });

    it("can list files", function (done) {
        api.vfs.listFiles("site/wwwroot", function (err, fileList) {
            if (err) {
                done(err);
            }

            assert.equal(typeof fileList.length, "number", "File list should be an array with valid length");
            done();
        });
    });

    it("can upload file", function (done) {
        api.vfs.uploadFile(localPath, "site/wwwroot/test.txt", done);
    });

    it("can validate an etag when uploading file", function (done) {
        api.vfs.uploadFile(localPath, "site/wwwroot/test.txt", "foo", function (err) {
            assert(err, "Should error with mismatched etag");
            done();
        });
    });

    it("can upload a file with a matching etag", function (done) {
        api.vfs.getFile("site/wwwroot/test.txt", function (err, ignore, response) {
            if (err) {
                done(err);
            }

            var etag = response.headers.etag;
            api.vfs.uploadFile(localPath, "site/wwwroot/test.txt", etag, done);
        });
    });

    it("can create directories", function (done) {
        api.vfs.createDirectory("site/wwwroot/test1/test2", done);
    });

    it("can delete a file", function (done) {
        api.vfs.deleteFile("site/wwwroot/test.txt", function (err, response) {
            if (err) {
                return done(err);
            }

            assert(response.statusCode < 400, "Deletion response status code should not be in the error range.");
            done();
        });
    });

    it("can delete a directory", function (done) {
        api.vfs.deleteDirectory("site/wwwroot/test1/test2", done);
    });
});
