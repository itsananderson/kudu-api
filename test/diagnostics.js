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
        api.diagnostics.list(function(err, settings) {
            if (err) {
                return done(err);
            }

            var keys = Object.keys(settings);
            assert.notEqual(keys.indexOf("AzureDriveEnabled"), -1, "Contains AzureDriveEnabled key");
            done();
        });
    });

    it("can retrieve a single diagnostics setting", function(done) {
        api.diagnostics.get("AzureDriveEnabled", function(err, setting) {
            if (err) {
                return done(err);
            }

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

            api.diagnostics.get("AzureDriveEnabled", function(err, setting) {
                if (err) {
                    return done(err);
                }

                assert.equal(setting, true);
                done();
            });
        });
    });

    it("can delete a setting", function(done) {
        api.diagnostics.set({"test_setting": true}, function(err) {
            if (err) {
                return done(err);
            }

            api.diagnostics.list(function(err, oldSettings) {
                if (err) {
                    return done(err);
                }

                api.diagnostics.del("test_setting", function(err) {
                    if (err) {
                        return done(err);
                    }

                    api.diagnostics.list(function(err, newSettings) {
                        if (err) {
                            return done(err);
                        }

                        var oldKeys = Object.keys(oldSettings);
                        var newKeys = Object.keys(newSettings);
                        assert.equal(newKeys.length, oldKeys.length - 1, "Settings key count should be old count minus 1");
                        done();
                    });
                });
            });
        });
    });

    it("gracefully handles missing key", function(done) {
        api.diagnostics.get("foo", function(err, setting) {
            assert(err, "Should error for missing key");
            assert(!setting, "When error is returned, setting should be null");
            done();
        });
    });
});
