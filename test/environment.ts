import * as assert from "assert";

import * as testUtils from "./test-utils";

var api;

describe("environment", function(): void {
  this.timeout(5000);

  describe("with standard credentials", function(): void {
    before(
      testUtils.setupKudu(false, function(kuduApi): void {
        api = kuduApi;
      })
    );

    it("can get the environment", function(done): void {
      api.environment.get(function(err, result): void {
        if (err) {
          done(err);
          return;
        }

        assert.notStrictEqual(
          result.data.version,
          undefined,
          "version is defined"
        );
        done();
      });
    });
  });

  describe("with basic credentials", function(): void {
    before(
      testUtils.setupKudu(true, function(kuduApi): void {
        api = kuduApi;
      })
    );

    it("can get the environment", function(done): void {
      api.environment.get(function(err, result): void {
        if (err) {
          done(err);
          return;
        }

        assert.notStrictEqual(
          result.data.version,
          undefined,
          "version is defined"
        );
        done();
      });
    });
  });
});
