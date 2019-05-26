import * as assert from "assert";
import * as fs from "fs";

import * as testUtils from "./test-utils";

var api;

describe("dump", function(): void {
  this.timeout(30 * 1000);

  var localPath = testUtils.artifactPath("dump1.zip");

  before(testUtils.ensureArtifacts);

  before(
    testUtils.setupKudu(false, function(kuduApi): void {
      api = kuduApi;
    })
  );

  afterEach(function(done): void {
    fs.unlink(localPath, function(): void {
      // Ignore errors
      done();
    });
  });

  it("can retrieve dump", function(done): void {
    api.dump.download(localPath, function(err): void {
      if (err) {
        done(err);
        return;
      }

      fs.exists(localPath, function(exists): void {
        assert(exists, "Downloaded dump file exists");

        done();
      });
    });
  });
});
