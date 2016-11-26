"use strict";

var assert = require("assert");
var fs = require("fs");
var testUtils = require("./test-utils");
var retry = require("retry");
var api;

var triggeredFiles = {
    "run.cmd": "echo hello world %*"
};
var continuousFiles = {
    "run.js": "console.log(process.argv.join(' ')); setInterval(() => console.log('ping'), 30000);"
};

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

    function ensureResults(err, result) {
        err = err || resolveError(result.data);

        if (operation.retry(err)) {
            return;
        }

        cb(err && operation.mainError(), result);
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

    before(testUtils.setupKudu(function (kuduApi) {
        api = kuduApi;
    }));

    before(testUtils.ensureArtifacts);

    describe("triggered basic operations", function () {
        var jobName = "triggered-job-1";
        var localPath = testUtils.artifactPath(jobName + ".zip");

        before(function (done) {
            testUtils.createZipFile(localPath, triggeredFiles, function (err) {
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
            api.webjobs.listAll(function (err, result) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.data.length, 1, "Web job list should contain one entry.");
                done();
            });
        });

        it("can list triggered webjobs", function (done) {
            api.webjobs.listTriggered(function (err, result) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.data.length, 1, "Triggered job list should contain one entry.");
                done();
            });
        });

        it("can list triggered webjobs as swagger", function (done) {
            api.webjobs.listTriggeredAsSwagger(function (err, result) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.data.swagger, "2.0", "Triggered job list as swagger should have expected version.");
                done();
            });
        });

        it("can get triggered webjob by name", function (done) {
            api.webjobs.getTriggered(jobName, function (err, result) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.data.name, jobName, "Triggered job data does not contain correct name.");
                done();
            });
        });

        it("should report error getting unknown triggered webjob", function (done) {
            api.webjobs.getTriggeredAsync("unknown-job")
                .then(function () {
                    done(new Error("Expected error was not thrown."));
                })
                .catch(function (err) {
                    assert.strictEqual(err.response.statusCode, 404, "Unknown triggered job error should contain status code.");

                    done();
                })
                .catch(done);
        });

        it("can run triggered webjob", function (done) {
            api.webjobs.runTriggered(jobName, function (err, result) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.response.statusCode, 202);
                done();
            });
        });

        it("should report error running unknown triggered webjob", function (done) {
            api.webjobs.runTriggeredAsync("unknown-job")
                .then(function () {
                    done(new Error("Expected error was not thrown."));
                })
                .catch(function (err) {
                    assert.strictEqual(err.response.statusCode, 404, "Unknown triggered job error should contain status code.");

                    done();
                })
                .catch(done);
        });

        it("can run triggered webjob with arguments", function (done) {
            api.webjobs.runTriggered(jobName, "--message \"Kudu's API\"", function (err, result) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.response.statusCode, 202);
                done();
            });
        });

        it("can list triggered webjob history", function (done) {
            api.webjobs.listTriggeredHistory(jobName, function (err, result) {
                if (err) {
                    return done(err);
                }

                assert(Array.isArray(result.data.runs), "History list for triggered job should contain runs.");
                done();
            });
        });

        it("can get triggered webjob history item by id", function (done) {
            api.webjobs.listTriggeredHistoryAsync(jobName)
                .then(function (result) {
                    return api.webjobs.getTriggeredHistoryAsync(jobName, result.data.runs[0].id);
                })
                .then(function (result) {
                    assert.strictEqual(result.data.output_url.slice(-4), ".txt", "History for triggered job should contain text output URL.");
                    done();
                })
                .catch(done);
        });
    });

    describe("triggered upload", function () {
        var jobName = "triggered-job-2";
        var localPath = testUtils.artifactPath(jobName + ".zip");

        before(function (done) {
            testUtils.createZipFile(localPath, triggeredFiles, done);
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
            api.webjobs.uploadTriggered(jobName, localPath, function (err, result) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.response.statusCode, 200, "Should respond with OK status code.");
                assert.strictEqual(result.data.type, "triggered", "Should have correct type.");
                done();
            });
        });
    });

    describe("triggered delete", function () {
        var jobName = "triggered-job-3";
        var localPath = testUtils.artifactPath(jobName + ".zip");

        before(function (done) {
            testUtils.createZipFile(localPath, triggeredFiles, done);
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
            api.webjobs.deleteTriggeredAsync(jobName)
                .then(function (result) {
                    assert.strictEqual(result.response.statusCode, 200, "Should respond with OK status code.");

                    return api.webjobs.getTriggeredAsync(jobName);
                })
                .then(function () {
                    done(new Error("Expected error was not thrown."));
                })
                .catch(function (err) {
                    assert.strictEqual(err.response.statusCode, 404, "Deleted triggered job should be not found.");

                    done();
                })
                .catch(done);
        });
    });

    describe("continuous basic operations", function () {
        var jobName = "continuous-job-1";
        var localPath = testUtils.artifactPath(jobName + ".zip");

        before(function (done) {
            testUtils.createZipFile(localPath, continuousFiles, function (err) {
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
            api.webjobs.listContinuous(function (err, result) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.data.length, 1, "Continuous job list should contain one entry.");
                done();
            });
        });

        it("can get continuous webjob by name", function (done) {
            api.webjobs.getContinuous(jobName, function (err, result) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.data.name, jobName, "Continuous job should have correct name.");
                done();
            });
        });

        it("can stop continuous webjob by name", function (done) {
            api.webjobs.stopContinuous(jobName, function (err, result) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.response.statusCode, 200, "Should respond with OK status code.");
                done();
            });
        });

        it("can start continuous webjob by name", function (done) {
            api.webjobs.startContinuous(jobName, function (err, result) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.response.statusCode, 200, "Should respond with OK status code.");
                done();
            });
        });

        it("can get continuous webjob settings", function (done) {
            api.webjobs.getContinuousSettings(jobName, function (err, result) {
                if (err) {
                    return done(err);
                }

                assert(!result.data.is_singleton, "Singleton setting should be false.");
                done();
            });
        });

        it("can set continuous webjob settings", function (done) {
            var settings = {
                is_singleton: false
            };

            api.webjobs.setContinuousSettings(jobName, settings, function (err, result) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.response.statusCode, 200, "Should respond with OK status code.");
                done();
            });
        });
    });

    describe("continuous upload", function () {
        var jobName = "continuous-job-2";
        var localPath = testUtils.artifactPath(jobName + ".zip");

        before(function (done) {
            testUtils.createZipFile(localPath, continuousFiles, done);
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
            api.webjobs.uploadContinuous(jobName, localPath, function (err, result) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.response.statusCode, 200, "Should respond with OK status code.");
                assert.strictEqual(result.data.type, "continuous", "Should have correct type.");
                done();
            });
        });
    });

    describe("continuous delete", function () {
        var jobName = "continuous-job-3";
        var localPath = testUtils.artifactPath(jobName + ".zip");

        before(function (done) {
            testUtils.createZipFile(localPath, continuousFiles, done);
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
            api.webjobs.deleteContinuous(jobName, function (err, result) {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.response.statusCode, 200, "Should respond with OK status code.");

                api.webjobs.getContinuous(jobName, function (err) {
                    assert(err);
                    assert.strictEqual(err.response.statusCode, 404, "Deleted continuous job should be not found.");

                    done();
                });
            });
        });
    });
});
