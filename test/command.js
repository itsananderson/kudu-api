var api = require("../")(process.env.WEBSITE, process.env.USERNAME, process.env.PASSWORD);

describe("command", function() {
    this.timeout(5000);

    it("can execute a command", function(done) {
        api.command.exec("echo hello world", "site", function() {
            done();
        });
    });
});
