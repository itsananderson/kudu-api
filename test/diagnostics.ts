"use strict";

var assert = require("assert");
var testUtils = require("./test-utils");
var api;

describe("diagnostics", function() {
    this.timeout(5000);

    before(testUtils.setupKudu(function (kuduApi) {
        api = kuduApi;
    }));

    it("can retrieve all diagnostics settings", function(done) {
        api.diagnostics.list(function(err, result) {
            if (err) {
                return done(err);
            }

            var keys = Object.keys(result.data);
            assert.notEqual(keys.indexOf("AzureDriveEnabled"), -1, "Contains AzureDriveEnabled key");
            done();
        });
    });

    it("can retrieve a single diagnostics setting", function(done) {
        api.diagnostics.get("AzureDriveEnabled", function(err, result) {
            if (err) {
                return done(err);
            }

            var setting = result.data;

            assert.notStrictEqual(setting, undefined, "AzureDriveEnabled setting is not undefined");
            assert.notStrictEqual(setting, null, "AzureDriveEnabled setting is not null");
            assert.notStrictEqual(setting, "", "AzureDriveEnabled setting is not an empty string");
            done();
        });
    });

    it("can update diagnotics settings", function(done) {
        api.diagnostics.set({ AzureDriveEnabled: true}, function(err) {
            if (err) {
                return done(err);
            }

            api.diagnostics.get("AzureDriveEnabled", function(err, result) {
                if (err) {
                    return done(err);
                }

                assert.equal(result.data, true);
                done();
            });
        });
    });

    it("can delete a setting", function(done) {
        api.diagnostics.set({"test_setting": true}, function(err) {
            if (err) {
                return done(err);
            }

            api.diagnostics.list(function(err, result) {
                if (err) {
                    return done(err);
                }

                var oldSettings = result.data;

                api.diagnostics.del("test_setting", function(err) {
                    if (err) {
                        return done(err);
                    }

                    api.diagnostics.list(function(err, result) {
                        if (err) {
                            return done(err);
                        }

                        var oldKeys = Object.keys(oldSettings);
                        var newKeys = Object.keys(result.data);
                        assert.equal(newKeys.length, oldKeys.length - 1, "Settings key count should be old count minus 1");
                        done();
                    });
                });
            });
        });
    });

    it("gracefully handles missing key", function(done) {
        api.diagnostics.get("foo", function(err, result) {
            assert(err, "Should error for missing key");
            assert(!result, "When error is returned, result should be null");
            done();
        });
    });
});
