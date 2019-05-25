import * as assert from "assert";

import * as testUtils from "./test-utils";

var api;

describe("extensions", function (): void {
    this.timeout(5000);

    var availableExtensions;

    before(testUtils.setupKudu(false, function (kuduApi): void {
        api = kuduApi;
    }));

    before(function (done): void {
        api.extensions.feed.list(function (err, result): void {
            if (err) {
                done(err);
                return;
            }

            availableExtensions = result.data;
            done();
        });
    });

    it("can filter feed extensions", function (done): void {
        api.extensions.feed.list("filecounter", function (err, result): void {
            if (err) {
                done(err);
                return;
            }

            assert(result.data.length < availableExtensions.length, "Available extensions should be filtered");
            done();
        });
    });

    it("can get a specific feed extension", function (done): void {
        api.extensions.feed.get("filecounter", function (err, result): void {
            if (err) {
                done(err);
                return;
            }

            assert(result.data, "Queried extension exists");
            done();
        });
    });

    it("can list installed extensions", function (done): void {
        api.extensions.site.list(function (err, result): void {
            if (err) {
                done(err);
                return;
            }

            assert(Array.isArray(result.data), "Installed extensions should be an array");
            done();
        });
    });

    it("can filter installed extensions", function (done): void {
        api.extensions.site.list("filecounter", function (err, result): void {
            if (err) {
                done(err);
                return;
            }

            assert(Array.isArray(result.data), "Installed extensions should be filterable");
            done();
        });
    });

    it("can add or update a package", function (done): void {
        this.timeout(10 * 1000);

        api.extensions.feed.getAsync("filecounter")
            .then(function (result): void {
                api.extensions.site.setAsync(result.data.id, result.data);
            })
            .then(function (result): void {
                assert.equal(result.data.provisioningState, "Succeeded", "Should have successfully provisioned");
                done();
            })
            .catch(done);
    });

    it("can delete a package", function (done): void {
        this.timeout(30 * 1000);
        var oldExtensions;

        api.extensions.feed.getAsync("filecounter")
            .then(function (result): Promise<{}> {
                return api.extensions.site.setAsync(result.data.id, result.data);
            })
            .then(function (result): Promise<{}[]> {
                assert(result.data);

                return api.extensions.site.listAsync();
            })
            .then(function (result): Promise<{}> {
                oldExtensions = result.data;

                return api.extensions.site.delAsync("filecounter");
            })
            .then(function (result): Promise<{}>{
                assert(result.data);

                return api.extensions.site.listAsync();
            })
            .then(function (result): void {
                assert.equal(result.data.length, oldExtensions.length - 1, "Should be one less extension installed");
                done();
            })
            .catch(done);
    });
});
