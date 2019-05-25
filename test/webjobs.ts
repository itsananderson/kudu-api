import * as assert from "assert";
import * as fs from "fs";
import * as retry from "retry";

import * as testUtils from "./test-utils";

var api;

var triggeredFiles = {
    "run.cmd": "echo hello world %*"
};
var continuousFiles = {
    "run.js": "console.log(process.argv.join(' ')); setInterval(() => console.log('ping'), 30000);"
};

function createPollingCallback(cb): (err?: Error) => void {
    var operation = retry.operation({
        retries: 5
    });

    function resolveError(data): Error | undefined {
        if (data.length) {
            return;
        }

        return new Error("Job list is empty.");
    }

    function ensureResults(err, result): void {
        err = err || resolveError(result.data);

        if (operation.retry(err)) {
            return;
        }

        cb(err && operation.mainError(), result);
    }

    return (err?: Error): void => {
        if (err) {
            return cb(err);
        }

        operation.attempt((): void => {
            api.webjobs.listAll(ensureResults);
        });
    };
}

describe("webjobs", function (): void {
    this.timeout(10000);

    before(testUtils.setupKudu(false, (kuduApi): void => {
        api = kuduApi;
    }));

    before(testUtils.ensureArtifacts);

    describe("triggered basic operations", (): void => {
        var jobName = "triggered-job-1";
        var localPath = testUtils.artifactPath(jobName + ".zip");

        before((done): void => {
            testUtils.createZipFile(localPath, triggeredFiles, (err): void => {
                if (err) {
                    return done(err);
                }

                api.webjobs.uploadTriggered(jobName, localPath, createPollingCallback(done));
            });
        });

        after((done): void => {
            api.webjobs.deleteTriggered(jobName, (): void => {
                fs.unlink(localPath, done);
            });
        });

        it("can list all webjobs", function (done): void {
            api.webjobs.listAll((err, result): void => {
                if (err) {
                    done(err);
                    return;
                }

                assert.strictEqual(result.data.length, 1, "Web job list should contain one entry.");
                done();
            });
        });

        it("can list triggered webjobs", function (done): void {
            api.webjobs.listTriggered((err, result): void => {
                if (err) {
                    done(err);
                    return;
                }

                assert.strictEqual(result.data.length, 1, "Triggered job list should contain one entry.");
                done();
            });
        });

        it("can list triggered webjobs as swagger", function (done): void {
            api.webjobs.listTriggeredAsSwagger((err, result): void => {
                if (err) {
                    done(err);
                    return;
                }

                assert.strictEqual(result.data.swagger, "2.0", "Triggered job list as swagger should have expected version.");
                done();
            });
        });

        it("can get triggered webjob by name", function (done): void {
            api.webjobs.getTriggered(jobName, (err, result): void => {
                if (err) {
                    done(err);
                    return;
                }

                assert.strictEqual(result.data.name, jobName, "Triggered job data does not contain correct name.");
                done();
            });
        });

        it("should report error getting unknown triggered webjob", function (done): void {
            api.webjobs.getTriggeredAsync("unknown-job")
                .then((): void => {
                    done(new Error("Expected error was not thrown."));
                })
                .catch((err): void => {
                    assert.strictEqual(err.response.statusCode, 404, "Unknown triggered job error should contain status code.");

                    done();
                })
                .catch(done);
        });

        it("can run triggered webjob", function (done): void {
            api.webjobs.runTriggered(jobName, (err, result): void => {
                if (err) {
                    done(err);
                    return;
                }

                assert.strictEqual(result.response.statusCode, 202);
                done();
            });
        });

        it("should report error running unknown triggered webjob", function (done): void {
            api.webjobs.runTriggeredAsync("unknown-job")
                .then((): void => {
                    done(new Error("Expected error was not thrown."));
                })
                .catch((err): void => {
                    assert.strictEqual(err.response.statusCode, 404, "Unknown triggered job error should contain status code.");

                    done();
                })
                .catch(done);
        });

        it("can run triggered webjob with arguments", function (done): void {
            api.webjobs.runTriggered(jobName, "--message \"Kudu's API\"", (err, result): void => {
                if (err) {
                    done(err);
                    return;
                }

                assert.strictEqual(result.response.statusCode, 202);
                done();
            });
        });

        it("can list triggered webjob history", function (done): void {
            api.webjobs.listTriggeredHistory(jobName, (err, result): void => {
                if (err) {
                    done(err);
                    return;
                }

                assert(Array.isArray(result.data.runs), "History list for triggered job should contain runs.");
                done();
            });
        });

        it("can get triggered webjob history item by id", function (done): void {
            api.webjobs.listTriggeredHistoryAsync(jobName)
                .then(function (result): void {
                    return api.webjobs.getTriggeredHistoryAsync(jobName, result.data.runs[0].id);
                })
                .then((result): void => {
                    assert.strictEqual(result.data.output_url.slice(-4), ".txt", "History for triggered job should contain text output URL.");
                    done();
                })
                .catch(done);
        });
    });

    describe("triggered upload", function (): void {
        var jobName = "triggered-job-2";
        var localPath = testUtils.artifactPath(jobName + ".zip");

        before((done): void => {
            testUtils.createZipFile(localPath, triggeredFiles, done);
        });

        after((done): void => {
            fs.unlink(localPath, done);
        });

        afterEach((done): void =>  {
            api.webjobs.deleteTriggered(jobName, function (): void {
                // Ignore errors.
                done();
            });
        });

        it("can upload triggered webjob", function (done): void {
            api.webjobs.uploadTriggered(jobName, localPath, (err, result): void => {
                if (err) {
                    done(err);
                    return;
                }

                assert.strictEqual(result.response.statusCode, 200, "Should respond with OK status code.");
                assert.strictEqual(result.data.type, "triggered", "Should have correct type.");
                done();
            });
        });
    });

    describe("triggered delete", function (): void {
        var jobName = "triggered-job-3";
        var localPath = testUtils.artifactPath(jobName + ".zip");

        before((done): void => {
            testUtils.createZipFile(localPath, triggeredFiles, done);
        });

        after((done): void => {
            fs.unlink(localPath, done);
        });

        beforeEach((done): void => {
            api.webjobs.uploadTriggered(jobName, localPath, done);
        });

        afterEach((done): void => {
            api.webjobs.deleteTriggered(jobName, done);
        });

        it("can delete triggered webjob", function (done): void {
            api.webjobs.deleteTriggeredAsync(jobName)
                .then((result): void => {
                    assert.strictEqual(result.response.statusCode, 200, "Should respond with OK status code.");

                    return api.webjobs.getTriggeredAsync(jobName);
                })
                .then((): void => {
                    done(new Error("Expected error was not thrown."));
                })
                .catch((err): void => {
                    assert.strictEqual(err.response.statusCode, 404, "Deleted triggered job should be not found.");

                    done();
                })
                .catch(done);
        });
    });

    describe("continuous basic operations", function (): void {
        var jobName = "continuous-job-1";
        var localPath = testUtils.artifactPath(jobName + ".zip");

        before((done): void => {
            testUtils.createZipFile(localPath, continuousFiles, function (err): void {
                if (err) {
                    return done(err);
                }

                api.webjobs.uploadContinuous(jobName, localPath, createPollingCallback(done));
            });
        });

        after((done): void => {
            api.webjobs.deleteContinuous(jobName, (): void => {
                fs.unlink(localPath, done);
            });
        });

        it("can list continuous webjobs", function (done): void {
            api.webjobs.listContinuous((err, result): void => {
                if (err) {
                    done(err);
                    return;
                }

                assert.strictEqual(result.data.length, 1, "Continuous job list should contain one entry.");
                done();
            });
        });

        it("can get continuous webjob by name", function (done): void {
            api.webjobs.getContinuous(jobName, (err, result): void => {
                if (err) {
                    done(err);
                    return;
                }

                assert.strictEqual(result.data.name, jobName, "Continuous job should have correct name.");
                done();
            });
        });

        it("can stop continuous webjob by name", function (done): void {
            api.webjobs.stopContinuous(jobName, function (err, result): void {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.response.statusCode, 200, "Should respond with OK status code.");
                done();
            });
        });

        it("can start continuous webjob by name", function (done): void {
            api.webjobs.startContinuous(jobName, function (err, result): void {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.response.statusCode, 200, "Should respond with OK status code.");
                done();
            });
        });

        it("can get continuous webjob settings", function (done): void {
            api.webjobs.getContinuousSettings(jobName, function (err, result): void {
                if (err) {
                    return done(err);
                }

                assert(!result.data.is_singleton, "Singleton setting should be false.");
                done();
            });
        });

        it("can set continuous webjob settings", function (done): void {
            var settings = {
                "is_singleton": false
            };

            api.webjobs.setContinuousSettings(jobName, settings, function (err, result): void {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.response.statusCode, 200, "Should respond with OK status code.");
                done();
            });
        });
    });

    describe("continuous upload", function (): void {
        var jobName = "continuous-job-2";
        var localPath = testUtils.artifactPath(jobName + ".zip");

        before(function (done): void {
            testUtils.createZipFile(localPath, continuousFiles, done);
        });

        after(function (done): void {
            fs.unlink(localPath, done);
        });

        afterEach(function (done): void {
            api.webjobs.deleteContinuous(jobName, function (): void {
                // Ignore errors.
                done();
            });
        });

        it("can upload continuous webjob", function (done): void {
            api.webjobs.uploadContinuous(jobName, localPath, function (err, result): void {
                if (err) {
                    done(err);
                    return;
                }

                assert.strictEqual(result.response.statusCode, 200, "Should respond with OK status code.");
                assert.strictEqual(result.data.type, "continuous", "Should have correct type.");
                done();
            });
        });
    });

    describe("continuous delete", function (): void {
        var jobName = "continuous-job-3";
        var localPath = testUtils.artifactPath(jobName + ".zip");

        before(function (done): void {
            testUtils.createZipFile(localPath, continuousFiles, done);
        });

        after(function (done): void {
            fs.unlink(localPath, done);
        });

        beforeEach(function (done): void {
            api.webjobs.uploadContinuous(jobName, localPath, done);
        });

        afterEach(function (done): void {
            api.webjobs.deleteContinuous(jobName, done);
        });

        it("can delete continuous webjob", function (done): void {
            api.webjobs.deleteContinuous(jobName, function (err, result): void {
                if (err) {
                    return done(err);
                }

                assert.strictEqual(result.response.statusCode, 200, "Should respond with OK status code.");

                api.webjobs.getContinuous(jobName, function (err): void {
                    assert(err);
                    assert.strictEqual(err.response.statusCode, 404, "Deleted continuous job should be not found.");

                    done();
                });
            });
        });
    });
});
