import * as assert from "assert";

import * as testUtils from "./test-utils";

var api;

describe("settings", function(): void {
  this.timeout(5000);

  before(
    testUtils.setupKudu(false, function(kuduApi): void {
      api = kuduApi;
    })
  );

  before(async function(): Promise<void> {
    await api.settings.set({ test_setting: "test" });
  });

  it("can retrieve all settings", async function(): Promise<void> {
    const response = await api.settings.list();
    assert.equal(
      response.payload.WEBSITE_SITE_NAME,
      process.env.WEBSITE,
      "Website sitname should match"
    );
  });

  it("can retrieve a single setting", async function(): Promise<void> {
    const response = await api.settings.get("WEBSITE_SITE_NAME");
    assert.equal(response.payload, process.env.WEBSITE);
  });

  it("can update settings", async function(): Promise<void> {
    const response = await api.settings.get("test_setting");
    assert.equal(response.payload, "test");

    await api.settings.set({ test_setting: "test1" });

    const response2 = await api.settings.get("test_setting");
    assert.equal(response2.payload, "test1");
  });

  it("can delete a setting", async function(): Promise<void> {
    this.timeout(10 * 1000);

    await api.settings.set({ test_setting: "test" });
    const oldSettings = (await api.settings.list()).payload;

    await api.settings.del("test_setting");

    const oldKeys = Object.keys(oldSettings);
    const newKeys = Object.keys((await api.settings.list()).payload);
    assert.equal(
      newKeys.length,
      oldKeys.length - 1,
      "New keys count should be old count minus 1"
    );
  });
});
