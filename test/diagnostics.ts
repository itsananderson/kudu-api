import * as assert from "assert";

import * as testUtils from "./test-utils";
import { KuduApi } from "../index";

var api: KuduApi;

describe("diagnostics", function(): void {
  this.timeout(5000);

  before(
    testUtils.setupKudu(false, function(kuduApi: KuduApi): void {
      api = kuduApi;
    })
  );

  it("can retrieve all diagnostics settings", async function(): Promise<void> {
    const response = await api.diagnostics.list();

    var keys = Object.keys(response.payload);
    assert.notEqual(
      keys.indexOf("AzureDriveEnabled"),
      -1,
      "Contains AzureDriveEnabled key"
    );
  });

  it("can retrieve a single diagnostics setting", async function(): Promise<
    void
  > {
    const response = await api.diagnostics.get("AzureDriveEnabled");

    var setting = response.payload;

    assert.notStrictEqual(
      setting,
      undefined,
      "AzureDriveEnabled setting is not undefined"
    );
    assert.notStrictEqual(
      setting,
      null,
      "AzureDriveEnabled setting is not null"
    );
    assert.notStrictEqual(
      setting,
      "",
      "AzureDriveEnabled setting is not an empty string"
    );
  });

  it("can update diagnotics settings", async function(): Promise<void> {
    await api.diagnostics.set({ AzureDriveEnabled: true });

    const response = await api.diagnostics.get("AzureDriveEnabled");

    assert(response.payload, "Setting should be enabled");
  });

  it("can delete a setting", async function(): Promise<void> {
    await api.diagnostics.set({ testSetting: true });

    const response = await api.diagnostics.list();
    const oldSettings = response.payload;

    await api.diagnostics.del("testSetting");

    const response2 = await api.diagnostics.list();

    var oldKeys = Object.keys(oldSettings);
    var newKeys = Object.keys(response2.payload);
    assert.equal(
      newKeys.length,
      oldKeys.length - 1,
      "Settings key count should be old count minus 1"
    );
  });

  it("gracefully handles missing key", async function(): Promise<void> {
    try {
      await api.diagnostics.get("foo");
      assert.fail("Should fail to fetch a missing key");
    } catch (err) {
      assert.equal(
        err.rawResponse.statusCode,
        404,
        "Should get a 404 when fetching a missing key"
      );
    }
  });
});
