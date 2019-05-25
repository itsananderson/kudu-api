import * as assert from "assert";
import * as fs from "fs";

import * as testUtils from "./test-utils";

var api;

describe("dump", function() {
    this.timeout(30 * 1000);

    var localPath = testUtils.artifactPath("dump1.zip");

    before(testUtils.ensureArtifacts);

    before(testUtils.setupKudu(false, function (kuduApi) {
        api = kuduApi;
    }));

    afterEach(function(done) {
        fs.unlink(localPath, function () {
            // Ignore errors
            done();
        });
    });

    it("can retrieve dump", function(done) {
        api.dump.download(localPath, function(err) {
            if (err) {
                return done(err);
            }

            fs.exists(localPath, function (exists) {
                assert(exists, "Downloaded dump file exists");

                done();
            });
        });
    });
});
