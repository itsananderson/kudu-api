var assert = require("assert");
var api = require("../")(process.env.WEBSITE, process.env.USERNAME, process.env.PASSWORD);

describe("scm", function() {
    this.timeout(5000);

    before(function(done) {
        api.settings.set({test_setting: "test"}, done);
    });

    it("can retrieve all settings", function(done) {
        api.settings.list(function(err, settings) {
            done();
        });
    });
    it("can retrieve a single setting", function(done) {
        api.settings.get("WEBSITE_SITE_NAME", function(err, setting) {
            assert.equal(setting, process.env.WEBSITE);
            done();
        });
    });
    it("can update settings", function(done) {
        api.settings.get("test_setting", function(err, setting) {
            assert.equal(setting, "test");
            api.settings.set({test_setting: "test1"}, function(err) {
                api.settings.get("test_setting", function(err, setting) {
                    assert.equal(setting, "test1");
                    done();
                });
            });
        });
    });
    it("can delete a setting", function(done) {
        api.settings.del("test_setting", function(err) {
            done();
        });
    });
});
