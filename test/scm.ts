import * as assert from "assert";

import * as testUtils from "./test-utils";

var api;

describe("scm", function(): void {
  this.timeout(5000);

  before(
    testUtils.setupKudu(false, function(kuduApi): void {
      api = kuduApi;
    })
  );

  it("can retrieve info", function(done): void {
    api.scm.info(function(err, result): void {
      if (err) {
        return done(err);
      }

      var info = result.data;

      assert.notEqual(info.Type, undefined, "Type is defined");
      assert.notEqual(info.GitUrl, undefined, "GitUrl is defined");
      done();
    });
  });

  it("can clean repo", function(done): void {
    // Not much to test here
    // If successful, returns a 204. If no Git repo exists, returns a 500
    api.scm.clean(function(err, result): void {
      if (err) {
        assert.strictEqual(
          err.response.statusCode,
          500,
          "Should return 500 error if no Git repo exists"
        );
        return done();
      }

      assert.strictEqual(
        result.response.statusCode,
        204,
        "Should return 204 response if successful"
      );
      done();
    });
  });

  it("can delete repo", function(done): void {
    // If successful, default config is still returned, so this is hard to test
    api.scm.del(done);
  });
});
