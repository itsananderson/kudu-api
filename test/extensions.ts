import * as assert from "assert";

import * as testUtils from "./test-utils";
import { Extension } from "../lib/extensions";
import { KuduApi } from "../index";

let api: KuduApi;

describe("extensions", function(): void {
  this.timeout(5000);

  let availableExtensions: Extension[];

  before(
    testUtils.setupKudu(false, function(kuduApi: KuduApi): void {
      api = kuduApi;
    })
  );

  before(async function(): Promise<void> {
    const response = await api.extensions.feed.list();
    availableExtensions = response.payload;
  });

  it("can filter feed extensions", async function(): Promise<void> {
    const response = await api.extensions.feed.list("filecounter");
    assert(
      response.payload.length < availableExtensions.length,
      "Available extensions should be filtered"
    );
  });

  it("can get a specific feed extension", async function(): Promise<void> {
    const response = await api.extensions.feed.get("filecounter");
    assert(response.payload, "Queried extension exists");
  });

  it("can list installed extensions", async function(): Promise<void> {
    const response = await api.extensions.site.list();

    assert(
      Array.isArray(response.payload),
      "Installed extensions should be an array"
    );
  });

  it("can filter installed extensions", async function(): Promise<void> {
    const response = await api.extensions.site.list("filecounter");
    assert(
      Array.isArray(response.payload),
      "Installed extensions should be filterable"
    );
  });

  it("can add or update a package", async function(): Promise<void> {
    this.timeout(10 * 1000);

    const getResponse = await api.extensions.feed.get("filecounter");

    const setResponse = await api.extensions.site.set(
      getResponse.payload.id,
      getResponse.payload
    );
    assert.equal(
      setResponse.payload.provisioningState,
      "Succeeded",
      "Should have successfully provisioned"
    );
  });

  it("can delete a package", async function(): Promise<void> {
    this.timeout(30 * 1000);

    const response = await api.extensions.feed.get("filecounter");
    const response2 = await api.extensions.site.set(
      response.payload.id,
      response.payload
    );

    assert(response2.payload);

    const listResponse = await api.extensions.site.list();
    const oldExtensions = listResponse.payload;

    const deleteResponse = await api.extensions.site.del("filecounter");
    assert(deleteResponse.payload);

    const listResponse2 = await api.extensions.site.list();
    assert.equal(
      listResponse2.payload.length,
      oldExtensions.length - 1,
      "Should be one less extension installed"
    );
  });
});
