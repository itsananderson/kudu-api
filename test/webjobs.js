"use strict";

var assert = require("assert");
var fs = require("fs");
var JSZip = require("jszip");
var api = require("../")({website: process.env.WEBSITE, username: process.env.USERNAME, password: process.env.PASSWORD});

function createJobZip(localPath, cb) {
    var generateOptions = {
        type: "nodebuffer",
        streamFiles: true
    };

    var zip = new JSZip();
    zip.file("run.cmd", "echo hello world %*");
    zip.generateNodeStream(generateOptions)
        .pipe(fs.createWriteStream(localPath))
        .on("error", cb)
        .on("finish", cb);
}

describe("webjobs", function () {
    this.timeout(5000);

    describe("triggered read operations", function () {
        var localPath = "test/artifacts/triggered-job.zip";

        before(function (done) {
            createJobZip(localPath, function (err) {
                if (err) {
                    return done(err);
                }

                api.webjobs.uploadTriggered("triggered-job", localPath, done);
            });
        });

        after(function (done) {
            api.webjobs.deleteTriggered("triggered-job", function () {
                fs.unlink(localPath, done);
            });
        });

        it("can list all webjobs", function (done) {
            api.webjobs.listAll(function (err, data) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(data.length, 1, "Web job list should contain one entry.");
                done();
            });
        });

        it("can list triggered webjobs", function (done) {
            api.webjobs.listTriggered(function (err, data) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(data.length, 1, "Triggered job list should contain one entry.");
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

        it("can get triggered webjob by name", function (done) {
            api.webjobs.getTriggered("triggered-job", function (err, data) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(data.name, "triggered-job", "Triggered job data does not contain correct name.");
                done();
            });
        });

        it("should report error getting unknown triggered webjob", function (done) {
            api.webjobs.getTriggered("unknown-job", function (err) {
                if (err) {
                    var statusPattern = /404\ \(Not\ Found\)/;
                    assert(statusPattern.test(err.message), "Unknown triggered job error should contain status code.");

                    return done();
                }

                done(new Error("Expected error was not thrown."));
            });
        });

        it("can run triggered webjob", function (done) {
            api.webjobs.runTriggered("triggered-job", function (err, response) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(response.statusCode, 202);
                done();
            });
        });

        it("can run triggered webjob with arguments", function (done) {
            api.webjobs.runTriggered("triggered-job", "--message \"Kudu's API\"", function (err, response) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(response.statusCode, 202);
                done();
            });
        });

        it("should report error running unknown triggered webjob", function (done) {
            api.webjobs.runTriggered("unknown-job", function (err) {
                if (err) {
                    var statusPattern = /404\ \(Not\ Found\)/;
                    assert(statusPattern.test(err.message), "Unknown triggered job error should contain status code.");

                    return done();
                }

                done(new Error("Expected error was not thrown."));
            });
        });

        it("can list triggered webjob history", function (done) {
            api.webjobs.listTriggeredHistory("triggered-job", function (err, data) {
                if (err) {
                    return done(err);
                }

                assert(Array.isArray(data.runs), "History list for triggered job should contain runs.");
                done();
            });
        });
    });

    describe("triggered upload", function () {
        var localPath = "test/artifacts/triggered-job.zip";

        before(function (done) {
            createJobZip(localPath, done);
        });

        after(function (done) {
            fs.unlink(localPath, done);
        });

        afterEach(function (done) {
            api.webjobs.deleteTriggered("triggered-job", function () {
                // Ignore errors.
                done();
            });
        });

        it("can upload triggered webjob", function (done) {
            api.webjobs.uploadTriggered("triggered-job", localPath, function (err, data, response) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(response.statusCode, 200, "Should respond with OK status code.");
                assert.strictEqual(data.type, "triggered", "Should have correct type.");
                done();
            });
        });
    });

    describe("triggered delete", function () {
        var localPath = "test/artifacts/triggered-job.zip";

        before(function (done) {
            createJobZip(localPath, done);
        });

        after(function (done) {
            fs.unlink(localPath, done);
        });

        beforeEach(function (done) {
            api.webjobs.uploadTriggered("triggered-job", localPath, done);
        });

        afterEach(function (done) {
            api.webjobs.deleteTriggered("triggered-job", done);
        });

        it("can delete triggered webjob", function (done) {
            api.webjobs.deleteTriggered("triggered-job", function (err, response) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(response.statusCode, 200, "Should respond with OK status code.");
                done();
            });
        });

        it("can delete unknown triggered webjob", function (done) {
            api.webjobs.deleteTriggered("unknown-job", function (err, response) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(response.statusCode, 200, "Should respond with OK status code.");
                done();
            });
        });
    });
});
