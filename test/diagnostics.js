var assert = require("assert");
var api = require("../")(process.env.WEBSITE, process.env.USERNAME, process.env.PASSWORD);

describe("diagnostics", function() {
    this.timeout(5000);

    it("can retrieve all diagnostics settings", function(done) {
        api.diagnostics.list(function(err, settings) {
            done();
        });
    });
    it("can retrieve a single diagnostics setting", function(done) {
        api.diagnostics.get("AzureDriveEnabled", function(err, setting) {
            done();
        });
    });
    it("can update diagnotics settings", function(done) {
        api.settings.set({AzureDriveEnabled: true}, function(err) {
            api.settings.get("AzureDriveEnabled", function(err, setting) {
                assert.equal(setting, "True");
                done();
            });
        });
    });
    it("can delete a setting", function(done) {
        api.settings.del("AzureDriveEnabled", function(err) {
            done();
        });
    });
});
