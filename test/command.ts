import * as assert from "assert";

import * as testUtils from "./test-utils";

var api;

describe("command", function () {
    this.timeout(30000);

    before(testUtils.setupKudu(false, function (kuduApi) {
        api = kuduApi;
    }));

    it("can execute a command", function (done) {
        api.command.exec("echo hello world", "site", function (err, result) {
            if (err) {
                return done(err);
            }

            var data = result.data;

            assert.equal(data.Error, "", "Error should be empty");
            assert.equal(data.Output, "hello world\r\n", "Output should be 'hello world\\r\\n'");
            assert.equal(data.ExitCode, 0, "Exit code should be 0");
            done();
        });
    });

    it("can execute a command with a default dir", function (done) {
        api.command.execAsync("echo %CD%")
            .then(function (result) {
                var data = result.data;

                assert.equal(data.Error, "", "Error should be empty");
                assert.equal(data.Output, "D:\\home\r\n", "Output should be 'D:\\home\\r\\n'");
                assert.equal(data.ExitCode, 0, "Exit code should be 0");
                done();
            })
            .catch(done);
    });
});
