"use strict";

var assert = require("assert");
var fs = require("fs");
var JSZip = require("jszip");
var retry = require("retry");
var api = require("../")({website: process.env.WEBSITE, username: process.env.USERNAME, password: process.env.PASSWORD});

var triggeredFiles = {
    "run.cmd": "echo hello world %*"
};
var continuousFiles = {
    "run.js": "console.log(process.argv.join(' ')); setInterval(() => console.log('ping'), 30000);"
};

function createJobZip(localPath, files, cb) {
    var generateOptions = {
        type: "nodebuffer",
        streamFiles: true
    };

    var zip = new JSZip();

    Object.keys(files).forEach(function (key) {
        zip.file(key, files[key]);
    });

    zip.generateNodeStream(generateOptions)
        .pipe(fs.createWriteStream(localPath))
        .on("error", cb)
        .on("finish", cb);
}

function createPollingCallback(cb) {
    var operation = retry.operation({
        retries: 5
    });

    function resolveError(data) {
        if (data.length) {
            return;
        }

        return new Error("Job list is empty.");
    }

    function ensureResults(err, data) {
        err = err || resolveError(data);

        if (operation.retry(err)) {
            return;
        }

        cb(err && operation.mainError(), data);
    }

    return function pollingCallback(err) {
        if (err) {
            return cb(err);
        }

        operation.attempt(function () {
            api.webjobs.listAll(ensureResults);
        });
    };
}

describe("webjobs", function () {
    this.timeout(10000);

    before(function (done) {
        fs.mkdir("test/artifacts", function (err) {
            if (err && err.code !== "EEXIST") {
                return done(err);
            }

            done();
        });
    });

    describe("triggered basic operations", function () {
        var jobName = "triggered-job-1";
        var localPath = "test/artifacts/" + jobName + ".zip";

        before(function (done) {
            createJobZip(localPath, triggeredFiles, function (err) {
                if (err) {
                    return done(err);
                }

                api.webjobs.uploadTriggered(jobName, localPath, createPollingCallback(done));
            });
        });

        after(function (done) {
            api.webjobs.deleteTriggered(jobName, function () {
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
            api.webjobs.getTriggered(jobName, function (err, data) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(data.name, jobName, "Triggered job data does not contain correct name.");
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
            api.webjobs.runTriggered(jobName, function (err, response) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(response.statusCode, 202);
                done();
            });
        });

        it("can run triggered webjob with arguments", function (done) {
            api.webjobs.runTriggered(jobName, "--message \"Kudu's API\"", function (err, response) {
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
            api.webjobs.listTriggeredHistory(jobName, function (err, data) {
                if (err) {
                    return done(err);
                }

                assert(Array.isArray(data.runs), "History list for triggered job should contain runs.");
                done();
            });
        });

        it("can get triggered webjob history item by id", function (done) {
            api.webjobs.listTriggeredHistory(jobName, function (err, list) {
                if (err) {
                    return done(err);
                }

                api.webjobs.getTriggeredHistory(jobName, list.runs[0].id, function (err, item) {
                    if (err) {
                        return done(err);
                    }

                    assert.strictEqual(item.output_url.slice(-4), ".txt", "History for triggered job should contain text output URL.");
                    done();
                });
            });
        });
    });

    describe("triggered upload", function () {
        var jobName = "triggered-job-2";
        var localPath = "test/artifacts/" + jobName + ".zip";

        before(function (done) {
            createJobZip(localPath, triggeredFiles, done);
        });

        after(function (done) {
            fs.unlink(localPath, done);
        });

        afterEach(function (done) {
            api.webjobs.deleteTriggered(jobName, function () {
                // Ignore errors.
                done();
            });
        });

        it("can upload triggered webjob", function (done) {
            api.webjobs.uploadTriggered(jobName, localPath, function (err, data, response) {
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
        var jobName = "triggered-job-3";
        var localPath = "test/artifacts/" + jobName + ".zip";

        before(function (done) {
            createJobZip(localPath, triggeredFiles, done);
        });

        after(function (done) {
            fs.unlink(localPath, done);
        });

        beforeEach(function (done) {
            api.webjobs.uploadTriggered(jobName, localPath, done);
        });

        afterEach(function (done) {
            api.webjobs.deleteTriggered(jobName, done);
        });

        it("can delete triggered webjob", function (done) {
            api.webjobs.deleteTriggered(jobName, function (err, response) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(response.statusCode, 200, "Should respond with OK status code.");

                api.webjobs.getTriggered(jobName, function (err, ignore, response) {
                    assert(err);
                    assert.strictEqual(response.statusCode, 404, "Deleted triggered job should be not found.");

                    done();
                });
            });
        });
    });

    describe("continuous basic operations", function () {
        var jobName = "continuous-job-1";
        var localPath = "test/artifacts/" + jobName + ".zip";

        before(function (done) {
            createJobZip(localPath, continuousFiles, function (err) {
                if (err) {
                    return done(err);
                }

                api.webjobs.uploadContinuous(jobName, localPath, createPollingCallback(done));
            });
        });

        after(function (done) {
            api.webjobs.deleteContinuous(jobName, function () {
                fs.unlink(localPath, done);
            });
        });

        it("can list continuous webjobs", function (done) {
            api.webjobs.listContinuous(function (err, data) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(data.length, 1, "Continuous job list should contain one entry.");
                done();
            });
        });

        it("can get continuous webjob by name", function (done) {
            api.webjobs.getContinuous(jobName, function (err, data) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(data.name, jobName, "Continuous job should have correct name.");
                done();
            });
        });

        it("can stop continuous webjob by name", function (done) {
            api.webjobs.stopContinuous(jobName, function (err, response) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(response.statusCode, 200, "Should respond with OK status code.");
                done();
            });
        });

        it("can start continuous webjob by name", function (done) {
            api.webjobs.startContinuous(jobName, function (err, response) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(response.statusCode, 200, "Should respond with OK status code.");
                done();
            });
        });
    });

    describe("continuous upload", function () {
        var jobName = "continuous-job-2";
        var localPath = "test/artifacts/" + jobName + ".zip";

        before(function (done) {
            createJobZip(localPath, continuousFiles, done);
        });

        after(function (done) {
            fs.unlink(localPath, done);
        });

        afterEach(function (done) {
            api.webjobs.deleteContinuous(jobName, function () {
                // Ignore errors.
                done();
            });
        });

        it("can upload continuous webjob", function (done) {
            api.webjobs.uploadContinuous(jobName, localPath, function (err, data, response) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(response.statusCode, 200, "Should respond with OK status code.");
                assert.strictEqual(data.type, "continuous", "Should have correct type.");
                done();
            });
        });
    });

    describe("continuous delete", function () {
        var jobName = "continuous-job-3";
        var localPath = "test/artifacts/" + jobName + ".zip";

        before(function (done) {
            createJobZip(localPath, continuousFiles, done);
        });

        after(function (done) {
            fs.unlink(localPath, done);
        });

        beforeEach(function (done) {
            api.webjobs.uploadContinuous(jobName, localPath, done);
        });

        afterEach(function (done) {
            api.webjobs.deleteContinuous(jobName, done);
        });

        it("can delete continuous webjob", function (done) {
            api.webjobs.deleteContinuous(jobName, function (err, response) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(response.statusCode, 200, "Should respond with OK status code.");

                api.webjobs.getContinuous(jobName, function (err, ignore, response) {
                    assert(err);
                    assert.strictEqual(response.statusCode, 404, "Deleted continuous job should be not found.");

                    done();
                });
            });
        });
    });
});
