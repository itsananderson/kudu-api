import * as assert from "assert";
import * as fs from "fs";

import * as testUtils from "./test-utils";
import { KuduApi } from "../index";

let api: KuduApi;

describe("dump", function (): void {
  this.timeout(30 * 1000);

  const localPath: string = testUtils.artifactPath("dump1.zip");

  before(testUtils.ensureArtifacts);

  before(
    testUtils.setupKudu(false, function (kuduApi: KuduApi): void {
      api = kuduApi;
    })
  );

  afterEach(function (done): void {
    fs.unlink(localPath, function (): void {
      // Ignore errors
      done();
    });
  });

  it("can retrieve dump", async function (): Promise<void> {
    await api.dump.download(localPath);

    assert(
      await new Promise((resolve) => fs.exists(localPath, resolve)),
      "Downloaded dump file should exist"
    );
  });
});
