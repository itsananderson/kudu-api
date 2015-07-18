var assert = require("assert");
var fs = require("fs");
var path = require("path");
var api = require("../")(process.env.WEBSITE, process.env.USERNAME, process.env.PASSWORD);

describe("dump", function() {
    this.timeout(5000);

    it("can retrieve dump", function(done) {
        var dest = path.join(__dirname, "test.zip");
        if (fs.existsSync(dest)) {
            fs.unlinkSync(dest);
        }
        api.dump.download(dest, function() {
            assert(fs.existsSync(dest), "Downloaded dump file exists");
            done();
        });
    });
});
