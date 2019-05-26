import * as assert from "assert";
import * as fs from "fs";
import * as testUtils from "./test-utils";

var api;

var localZipPath = testUtils.artifactPath("test.zip");

function deleteLocalZip(done): void {
    fs.unlink(localZipPath, function (): void {
        // Ignore errors
        done();
    });
}

describe("zip", function (): void {
    this.timeout(5000);

    before(testUtils.setupKudu(false, function (kuduApi): void {
        api = kuduApi;
    }));

    before(testUtils.ensureArtifacts);

    beforeEach(deleteLocalZip);

    afterEach(deleteLocalZip);

    it("can upload a zip", function (done): void {
        var localZipContents = {
            "test.txt": "test\n"
        };

        testUtils.createZipFile(localZipPath, localZipContents, function (err): void {
            if (err) {
                return done(err);
            }

            api.zip.upload(localZipPath, "site/wwwroot", done);
        });
    });

    it("should return a server error uploading to a folder with illegal characters", function (done): void {
        var localZipContents = {
            "test.txt": "test\n"
        };

        testUtils.createZipFileAsync(localZipPath, localZipContents)
            .then(function (): Promise<void> {
                return api.zip.uploadAsync(localZipPath, "site/wwwroot/illegal-character\"");
            })
            .then(function (): void {
                throw new Error("Upload with illegal characters in path should not succeed.");
            })
            .catch(function (err): void {
                if (!err.response) {
                    throw err;
                }

                assert.strictEqual(err.response.statusCode, 500, "Error status code should be 500.");
                done();
            })
            .catch(done);
    });

    it("can download a folder as a zip", function (done): void {
        this.timeout(30 * 1000);

        fs.exists(localZipPath, function (exists): void {
            assert(!exists, "Local zip should not exist before download");

            api.zip.download("site/wwwroot", localZipPath, function (err): void {
                if (err) {
                    return done(err);
                }

                fs.exists(localZipPath, function (exists): void {
                    assert(exists, "Local zip should exist after download");

                    done();
                });
            });
        });
    });


    it("downloads complete zips without truncation", function(done): void {
        this.timeout(30 * 1000);

        // The zip download API doesn't report the size of the zip file, so there's no way to verify that the zip
        // file is the correct size. The best we can do is download several times and verify that the file sizes
        // are all equal.
        //
        // For bug report: https://github.com/itsananderson/kudu-api/issues/21

        var downloadSizes = [];

        function download(cb): void {
            if (fs.existsSync(localZipPath)) {
                fs.unlinkSync(localZipPath);
            }

            api.zip.download("site/wwwroot", localZipPath, function(err): void {
                if (err) {
                    done(err);
                    return;
                }

                fs.exists(localZipPath, function(exists): void {
                    assert(exists, "Local zip should exist after download");

                    cb(fs.statSync(localZipPath).size);
                });
            });
        }

        // Store downloaded file size. If we've downloaded 5 times, confirm that all the sizes match
        function validateDownload(size): void {
            downloadSizes.push(size);

            if (downloadSizes.length >= 5) {
                var firstSize = downloadSizes[0];
                for (var i = 1; i < downloadSizes.length; i++) {
                    assert.equal(firstSize, downloadSizes[i]);
                }
                done();
            } else {
                download(validateDownload);
            }
        }

        // Kick off first download
        download(validateDownload);
    });

    it("should return a not found error downloading a non-existent folder", function (done): void {
        api.zip.download("site/wwwroot/does-not-exist", localZipPath, function (err): void {
            assert(err, "Error should exist.");
            assert.strictEqual(err.response.statusCode, 404, "Error status code should be 404.");
            done();
        });
    });
});
