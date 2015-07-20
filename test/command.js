var api = require("../")(process.env.WEBSITE, process.env.USERNAME, process.env.PASSWORD);

describe("command", function() {
    it("can execute a command", function(done) {
        this.timeout(30000);
        api.command.exec("echo hello world", "site", function() {
            done();
        });
    });
});
