import * as assert from "assert";

import * as testUtils from "./test-utils";
import { KuduApi } from "../index";

let api: KuduApi;

describe("logs", function(): void {
  this.timeout(5000);

  before(
    testUtils.setupKudu(false, function(kuduApi: KuduApi): void {
      api = kuduApi;
    })
  );

  it("can retrieve recent logs", async function(): Promise<void> {
    const response = await api.logs.recent();
    assert(Array.isArray(response.payload), "logs should be an array");
  });

  it("can retrieve custom number of recent logs", async function(): Promise<
    void
  > {
    var query = {
      top: 500
    };

    const response = await api.logs.recent(query);
    assert(Array.isArray(response.payload), "logs should be an array");
  });
});
