import * as assert from "assert";

import * as testUtils from "./test-utils";
import { KuduApi } from "../index";

let api: KuduApi;

describe("environment", function (): void {
  this.timeout(5000);

  describe("with standard credentials", function (): void {
    before(
      testUtils.setupKudu(false, function (kuduApi: KuduApi): void {
        api = kuduApi;
      })
    );

    it("can get the environment", async function (): Promise<void> {
      const response = await api.environment.get();

      assert.notStrictEqual(
        response.payload.version,
        undefined,
        "version is defined"
      );
    });
  });

  describe("with basic credentials", function (): void {
    before(
      testUtils.setupKudu(true, function (kuduApi): void {
        api = kuduApi;
      })
    );

    it("can get the environment", async function (): Promise<void> {
      const response = await api.environment.get();

      assert.notStrictEqual(
        response.payload.version,
        undefined,
        "version is defined"
      );
    });
  });
});
