var fs = require("fs");
var path = require("path");
var api = require("../")(process.env.WEBSITE, process.env.USERNAME, process.env.PASSWORD);
var exec = require("child_process").exec;

var localZipPath = path.join(__dirname, "test.zip");

describe("zip", function() {
    this.timeout(5000);

    it("can upload a zip", function(done) {
        fs.unlink(localZipPath, function() {
            exec("zip -r " + localZipPath + " lib", function() {
                api.zip.upload(localZipPath, "site/wwwroot", function() {
                    done();
                });
            });
        });
    });
    it("can download a zip", function(done) {
        this.timeout(30 * 1000);
        fs.unlink(localZipPath, function() {
            api.zip.download("site/wwwroot", localZipPath, function() {
                done();
            });
        });
    });
});