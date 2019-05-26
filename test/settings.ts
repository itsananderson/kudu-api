import * as assert from "assert";

import * as testUtils from "./test-utils";

var api;

describe("settings", function(): void {
    this.timeout(5000);

    before(testUtils.setupKudu(false, function (kuduApi): void {
        api = kuduApi;
    }));

    before(function(done): void {
        api.settings.set({"test_setting": "test"}, done);
    });

    it("can retrieve all settings", function(done): void {
        api.settings.list(function(err, result): void {
            if (err) {
                return done(err);
            }

            assert.equal(result.data.WEBSITE_SITE_NAME, process.env.WEBSITE, "Website sitname should match");
            done();
        });
    });

    it("can retrieve a single setting", function(done): void {
        api.settings.get("WEBSITE_SITE_NAME", function(err, result): void {
            if (err) {
                return done(err);
            }

            assert.equal(result.data, process.env.WEBSITE);
            done();
        });
    });

    it("can update settings", function(done): void {
        api.settings.get("test_setting", function(err, result): void {
            if (err) {
                return done(err);
            }

            assert.equal(result.data, "test");

            api.settings.set({"test_setting": "test1"}, function(err): void {
                if (err) {
                    return done(err);
                }

                api.settings.get("test_setting", function(err, result): void {
                    if (err) {
                        return done(err);
                    }

                    assert.equal(result.data, "test1");
                    done();
                });
            });
        });
    });

    it("can delete a setting", function(done): void {
        this.timeout(10 * 1000);

        api.settings.set({"test_setting": "test"}, function(err): void {
            if (err) {
                return done(err);
            }

            api.settings.list(function(err, result): void {
                if (err) {
                    return done(err);
                }

                var oldSettings = result.data;

                api.settings.del("test_setting", function(err): void {
                    if (err) {
                        return done(err);
                    }

                    api.settings.list(function(err, result): void {
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
