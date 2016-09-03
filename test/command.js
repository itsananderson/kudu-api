var assert = require("assert");
var api = require("../")({website: process.env.WEBSITE, username: process.env.USERNAME, password: process.env.PASSWORD});

describe("command", function() {
    it("can execute a command", function(done) {
        this.timeout(30000);
        api.command.exec("echo hello world", "site", function(err, result) {
            if (err) done(err);

            assert.equal(result.Error, "", "Error should be empty");
            assert.equal(result.Output, "hello world\r\n", "Output should be 'hello world\\r\\n'");
            assert.equal(result.ExitCode, 0, "Exit code should be 0");
            done();
        });
    });

    it("can execute a command with a default dir", function(done) {
        this.timeout(30000);
        api.command.exec("echo %CD%", function(err, result) {
            if (err) done(err);

            assert.equal(result.Error, "", "Error should be empty");
            assert.equal(result.Output, "D:\\home\r\n", "Output should be 'D:\\home\\r\\n'");
            assert.equal(result.ExitCode, 0, "Exit code should be 0");
            done();
        });
    });
});
