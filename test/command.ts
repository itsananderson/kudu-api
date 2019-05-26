import * as assert from "assert";

import * as testUtils from "./test-utils";

var api;

describe("command", function(): void {
  this.timeout(30000);

  before(
    testUtils.setupKudu(false, function(kuduApi): void {
      api = kuduApi;
    })
  );

  it("can execute a command", async function(): Promise<void> {
    const response = await api.command.exec("echo hello world", "site");
    const payload = response.payload;

    assert.equal(payload.Error, "", "Error should be empty");
    assert.equal(
      payload.Output,
      "hello world\r\n",
      "Output should be 'hello world\\r\\n'"
    );
    assert.equal(payload.ExitCode, 0, "Exit code should be 0");
  });

  it("can execute a command with a default dir", async function(): Promise<
    void
  > {
    const response = await api.command.exec("echo %CD%");
    var payload = response.payload;

    assert.equal(payload.Error, "", "Error should be empty");
    assert.equal(
      payload.Output,
      "D:\\home\r\n",
      "Output should be 'D:\\home\\r\\n'"
    );
    assert.equal(payload.ExitCode, 0, "Exit code should be 0");
  });
});
