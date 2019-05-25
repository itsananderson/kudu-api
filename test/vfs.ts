import * as assert from "assert";
import * as fs from "fs";

import * as testUtils from "./test-utils";

var api;

describe("vfs", function (): void {
    this.timeout(5000);

    var localPath = testUtils.artifactPath("test1.txt");

    before(testUtils.setupKudu(false, function (kuduApi): void {
        api = kuduApi;
    }));

    before(testUtils.ensureArtifacts);

    before(function (done): void {
        fs.writeFile(localPath, "test\n", done);
    });

    before(function (done): void {
        api.vfs.uploadFile(localPath, "site/wwwroot/test.txt", done);
    });

    after(function (done): void {
        fs.unlink(localPath, function (): void {
            // Ignore errors
            done();
        });
    });

    it("can get a file", function (done): void {
        api.vfs.getFile("site/wwwroot/test.txt", function (err, result): void {
            if (err) {
                return done(err);
            }

            assert.equal(result.data.trim(), "test", "Trimmed file content should be 'test'");
            done();
        });
    });

    it("can list files", function (done): void {
        api.vfs.listFiles("site/wwwroot", function (err, result): void {
            if (err) {
                return done(err);
            }

            assert.equal(typeof result.data.length, "number", "File list should be an array with valid length");
            done();
        });
    });

    it("can upload file", function (done): void {
        api.vfs.uploadFile(localPath, "site/wwwroot/test.txt", done);
    });

    it("can validate an etag when uploading file", function (done): void {
        api.vfs.uploadFile(localPath, "site/wwwroot/test.txt", "foo", function (err): void {
            assert(err, "Should error with mismatched etag");
            done();
        });
    });

    it("can upload a file with a matching etag", function (done): void {
        api.vfs.getFile("site/wwwroot/test.txt", function (err, result): void {
            if (err) {
                return done(err);
            }

            var etag = result.response.headers.etag;
            api.vfs.uploadFile(localPath, "site/wwwroot/test.txt", etag, done);
        });
    });

    it("can create directories", function (done): void {
        api.vfs.createDirectory("site/wwwroot/test1/test2", done);
    });

    it("can delete a file", function (done): void {
        api.vfs.deleteFile("site/wwwroot/test.txt", function (err, result): void {
            if (err) {
                return done(err);
            }

            assert(result.response.statusCode < 400, "Deletion response status code should not be in the error range.");
            done();
        });
    });

    it("can delete a directory", function (done): void {
        api.vfs.deleteDirectory("site/wwwroot/test1/test2", done);
    });
});
