var assert = require("assert");
var api = require("../")(process.env.WEBSITE, process.env.USERNAME, process.env.PASSWORD);

describe("extensions", function() {
    this.timeout(5000);

    var availableExtensions;

    before(function(done) {
        api.extensions.feed.list(function(err, extensions) {
            availableExtensions = extensions;
            done();
        });
    });

    it("can filter feed extensions", function(done) {
        api.extensions.feed.list("np", function(err, extensions) {
            assert(extensions.length < availableExtensions.length, "Available extensions should be filtered");
            done();
        });
    });

    it("can get a specific feed extension", function(done) {
        api.extensions.feed.get("np", function(err, extension) {
            assert(extension, "Queried extension exists");
            done();
        });
    });

    it("can list installed extensions", function(done) {
        api.extensions.site.list(function(err, extensions) {
            assert.equal(typeof extensions.length, "number", "Installed extensions should be an array");
            done();
        });
    });

    it("can filter installed extensions", function(done) {
        api.extensions.site.list("np", function(err, extensions) {
            assert.equal(typeof extensions.length, "number", "Installed extensions should be filterable");
            done();
        });
    });

    it("can add or update a package", function(done) {
        this.timeout(10 * 1000);
        api.extensions.feed.get("np", function(err, extension) {
            api.extensions.site.set(extension.id, extension, function(err, installedExtension) {
                assert.equal(installedExtension.provisioningState, "Succeeded", "Should have successfully provisioned");
                done();
            });
        });
    });

    it("can delete a package", function(done) {
        this.timeout(30 * 1000);
        api.extensions.feed.get("np", function(err, extension) {
            api.extensions.site.set(extension.id, extension, function(err, installedExtension) {
                api.extensions.site.list(function(err, oldExtensions) {
                    api.extensions.site.del("np", function(err, deletedExtension) {
                        api.extensions.site.list(function(err, newExtensions) {
                            assert.equal(newExtensions.length, oldExtensions.length-1, "Should be one less extension installed");
                            done();
                        });
                    });
                });
            });
        });
    });
});