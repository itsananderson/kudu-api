import * as assert from "assert";

import * as testUtils from "./test-utils";

var api;

describe("sshkey", function(): void {
  this.timeout(5000);

  before(
    testUtils.setupKudu(false, function(kuduApi): void {
      api = kuduApi;
    })
  );

  it("can generate a new key if none exists", async function(): Promise<void> {
    const response = await api.sshkey.get(true);
    assert(/^ssh-rsa/.test(response.payload), "Should be a valid key");
  });

  it("can download key", async function(): Promise<void> {
    const response = await api.sshkey.get();
    assert(/^ssh-rsa/.test(response.payload), "Should be a valid key");
  });
});
