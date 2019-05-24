"use strict";

var assert = require("assert");
var testUtils = require("./test-utils");
var api;

describe("settings", function() {
    this.timeout(5000);

    before(testUtils.setupKudu(function (kuduApi) {
        api = kuduApi;
    }));

    before(function(done) {
        api.settings.set({test_setting: "test"}, done);
    });

    it("can retrieve all settings", function(done) {
        api.settings.list(function(err, result) {
            if (err) {
                return done(err);
            }

            assert.equal(result.data.WEBSITE_SITE_NAME, process.env.WEBSITE, "Website sitname should match");
            done();
        });
    });

    it("can retrieve a single setting", function(done) {
        api.settings.get("WEBSITE_SITE_NAME", function(err, result) {
            if (err) {
                return done(err);
            }

            assert.equal(result.data, process.env.WEBSITE);
            done();
        });
    });

    it("can update settings", function(done) {
        api.settings.get("test_setting", function(err, result) {
            if (err) {
                return done(err);
            }

            assert.equal(result.data, "test");

            api.settings.set({test_setting: "test1"}, function(err) {
                if (err) {
                    return done(err);
                }

                api.settings.get("test_setting", function(err, result) {
                    if (err) {
                        return done(err);
                    }

                    assert.equal(result.data, "test1");
                    done();
                });
            });
        });
    });

    it("can delete a setting", function(done) {
        this.timeout(10 * 1000);

        api.settings.set({test_setting: "test"}, function(err) {
            if (err) {
                return done(err);
            }

            api.settings.list(function(err, result) {
                if (err) {
                    return done(err);
                }

                var oldSettings = result.data;

                api.settings.del("test_setting", function(err) {
                    if (err) {
                        return done(err);
                    }

                    api.settings.list(function(err, result) {
                        var oldKeys = Object.keys(oldSettings);
                        var newKeys = Object.keys(result.data);
                        assert.equal(newKeys.length, oldKeys.length-1, "New keys count should be old count minus 1");
                        done();
                    });
                });
            });
        });
    });
});
