import * as assert from "assert";

import * as testUtils from "./test-utils";
import { KuduApi } from "../index";

let api: KuduApi;

describe("scm", function (): void {
  this.timeout(5000);

  before(
    testUtils.setupKudu(false, function (kuduApi: KuduApi): void {
      api = kuduApi;
    })
  );

  it("can retrieve info", async function (): Promise<void> {
    const response = await api.scm.info();

    const info = response.payload;

    assert.notEqual(info.Type, undefined, "Type is defined");
    assert.notEqual(info.GitUrl, undefined, "GitUrl is defined");
  });

  it("can clean repo", async function (): Promise<void> {
    // Not much to test here
    // If successful, returns a 204. If no Git repo exists, returns a 500
    try {
      const response = await api.scm.clean();
      assert.strictEqual(
        response.rawResponse.statusCode,
        204,
        "Should return 204 response if successful"
      );
    } catch (err) {
      assert.strictEqual(
        err.rawResponse.statusCode,
        500,
        "Should return 500 error if no Git repo exists"
      );
    }
  });

  it("can delete repo", async function (): Promise<void> {
    // If successful, default config is still returned, so this is hard to test
    await api.scm.del();
  });
});
