import * as assert from "assert";
import * as fs from "fs";

import * as testUtils from "./test-utils";

var api;

describe("vfs", function(): void {
  this.timeout(5000);

  var localPath = testUtils.artifactPath("test1.txt");

  before(
    testUtils.setupKudu(false, function(kuduApi): void {
      api = kuduApi;
    })
  );

  before(testUtils.ensureArtifacts);

  before(function(done): void {
    fs.writeFile(localPath, "test\n", done);
  });

  before(async function(): Promise<void> {
    await api.vfs.uploadFile(localPath, "site/wwwroot/test.txt");
  });

  after(function(done): void {
    fs.unlink(localPath, function(): void {
      // Ignore errors
      done();
    });
  });

  it("can get a file", async function(): Promise<void> {
    const response = await api.vfs.getFile("site/wwwroot/test.txt");

    assert.equal(
      response.payload.trim(),
      "test",
      "Trimmed file content should be 'test'"
    );
  });

  it("can list files", async function(): Promise<void> {
    const response = await api.vfs.listFiles("site/wwwroot");
    assert(Array.isArray(response.payload), "File list should be an array");
  });

  it("can upload file", async function(): Promise<void> {
    await api.vfs.uploadFile(localPath, "site/wwwroot/test.txt");
  });

  it("can validate an etag when uploading file", async function(): Promise<
    void
  > {
    try {
      await api.vfs.uploadFile(localPath, "site/wwwroot/test.txt", "foo");
      assert.fail("Uploading with a mismatched etag throw an exception");
    } catch (err) {
      assert(err, "Should error with mismatched etag");
      assert.equal(
        err.rawResponse.statusCode,
        412,
        "Status code should indicate an etag error"
      );
    }
  });

  it("can upload a file with a matching etag", async function(): Promise<void> {
    const response = await api.vfs.getFile("site/wwwroot/test.txt");
    var etag = response.rawResponse.headers.etag;
    await api.vfs.uploadFile(localPath, "site/wwwroot/test.txt", etag);
  });

  it("can create directories", async function(): Promise<void> {
    await api.vfs.createDirectory("site/wwwroot/test1/test2");
  });

  it("can delete a file", async function(): Promise<void> {
    const response = await api.vfs.deleteFile("site/wwwroot/test.txt");
    assert(
      response.rawResponse.statusCode < 400,
      "Deletion response status code should not be in the error range."
    );
  });

  it("can delete a directory", async function(): Promise<void> {
    await api.vfs.deleteDirectory("site/wwwroot/test1/test2");
  });
});
