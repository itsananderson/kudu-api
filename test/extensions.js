"use strict";

var assert = require("assert");
var testUtils = require("./test-utils");
var api;

describe("extensions", function () {
    this.timeout(5000);

    var availableExtensions;

    before(testUtils.setupKudu(function (kuduApi) {
        api = kuduApi;
    }));

    before(function (done) {
        api.extensions.feed.list(function (err, result) {
            if (err) {
                return done(err);
            }

            availableExtensions = result.data;
            done();
        });
    });

    it("can filter feed extensions", function (done) {
        api.extensions.feed.list("np", function (err, result) {
            if (err) {
                return done(err);
            }

            assert(result.data.length < availableExtensions.length, "Available extensions should be filtered");
            done();
        });
    });

    it("can get a specific feed extension", function (done) {
        api.extensions.feed.get("np", function (err, result) {
            if (err) {
                return done(err);
            }

            assert(result.data, "Queried extension exists");
            done();
        });
    });

    it("can list installed extensions", function (done) {
        api.extensions.site.list(function (err, result) {
            if (err) {
                return done(err);
            }

            assert(Array.isArray(result.data), "Installed extensions should be an array");
            done();
        });
    });

    it("can filter installed extensions", function (done) {
        api.extensions.site.list("np", function (err, result) {
            if (err) {
                return done(err);
            }

            assert(Array.isArray(result.data), "Installed extensions should be filterable");
            done();
        });
    });

    it("can add or update a package", function (done) {
        this.timeout(10 * 1000);
        api.extensions.feed.get("np", function (err, result) {
            if (err) {
                return done(err);
            }

            var extension = result.data;

            api.extensions.site.set(extension.id, extension, function (err, result) {
                if (err) {
                    return done(err);
                }

                assert.equal(result.data.provisioningState, "Succeeded", "Should have successfully provisioned");
                done();
            });
        });
    });

    it("can delete a package", function (done) {
        this.timeout(30 * 1000);
        api.extensions.feed.get("np", function (err, result) {
            if (err) {
                return done(err);
            }

            var extension = result.data;

            api.extensions.site.set(extension.id, extension, function (err, result) {
                if (err) {
                    return done(err);
                }

                assert(result.data);

                api.extensions.site.list(function (err, result) {
                    if (err) {
                        return done(err);
                    }

                    var oldExtensions = result.data;

                    api.extensions.site.del("np", function (err, result) {
                        if (err) {
                            return done(err);
                        }

                        assert(result.data);

                        api.extensions.site.list(function (err, result) {
                            if (err) {
                                return done(err);
                            }

                            assert.equal(result.data.length, oldExtensions.length - 1, "Should be one less extension installed");
                            done();
                        });
                    });
                });
            });
        });
    });
});
