import * as assert from "assert";
import * as fs from "fs";
import * as testUtils from "./test-utils";
import { KuduApi } from "../index";

let api: KuduApi;

var localZipPath = testUtils.artifactPath("test.zip");

function deleteLocalZip(done): void {
  fs.unlink(localZipPath, function(): void {
    // Ignore errors
    done();
  });
}

describe("zip", function(): void {
  this.timeout(5000);

  before(
    testUtils.setupKudu(false, function(kuduApi: KuduApi): void {
      api = kuduApi;
    })
  );

  before(testUtils.ensureArtifacts);

  beforeEach(deleteLocalZip);

  afterEach(deleteLocalZip);

  it("can upload a zip", async function(): Promise<void> {
    this.timeout(10 * 1000);

    var localZipContents = {
      "test.txt": "test\n"
    };

    await testUtils.createZipFileAsync(localZipPath, localZipContents);
    await api.zip.upload(localZipPath, "site/wwwroot");
  });

  it("should return a server error uploading to a folder with illegal characters", async function(): Promise<
    void
  > {
    var localZipContents = {
      "test.txt": "test\n"
    };

    await testUtils.createZipFileAsync(localZipPath, localZipContents);

    try {
      await api.zip.upload(localZipPath, 'site/wwwroot/illegal-character"');
      assert.fail("Upload with illegal characters in path should not succeed.");
    } catch (err) {
      assert.strictEqual(
        err.rawResponse.statusCode,
        500,
        "Error status code should be 500."
      );
    }
  });

  it("can download a folder as a zip", async function(): Promise<void> {
    this.timeout(30 * 1000);

    assert(
      !fs.existsSync(localZipPath),
      "Local zip should not exist before download"
    );

    await api.zip.download("site/wwwroot", localZipPath);

    assert(
      fs.existsSync(localZipPath),
      "Local zip should exist after download"
    );
  });

  it("downloads complete zips without truncation", async function(): Promise<
    void
  > {
    this.timeout(30 * 1000);

    // The zip download API doesn't report the size of the zip file, so there's no way to verify that the zip
    // file is the correct size. The best we can do is download several times and verify that the file sizes
    // are all equal.
    //
    // For bug report: https://github.com/itsananderson/kudu-api/issues/21

    var downloadSizes = [];

    for (let downloads = 0; downloads < 5; downloads++) {
      if (fs.existsSync(localZipPath)) {
        fs.unlinkSync(localZipPath);
      }
      await api.zip.download("site/wwwroot", localZipPath);
      assert(
        fs.existsSync(localZipPath),
        "Local zip should exist after download"
      );

      downloadSizes.push(fs.statSync(localZipPath).size);
    }
  });

  it("should return a not found error downloading a non-existent folder", async function(): Promise<
    void
  > {
    try {
      await api.zip.download("site/wwwroot/does-not-exist", localZipPath);
      assert.fail("Should fail to download");
    } catch (err) {
      assert.strictEqual(
        err.rawResponse.statusCode,
        404,
        "Error status code should be 404."
      );
    }
  });
});
