var assert = require("assert");
var path = require("path");
var api = require("../")(process.env.WEBSITE, process.env.USERNAME, process.env.PASSWORD);

describe("vfs", function() {
    this.timeout(5000);

    before(function(done) {
        api.vfs.uploadFile(path.join(__dirname, "test.txt"), "site/wwwroot/test.txt", done);
    });

    it("can get a file", function(done) {
        api.vfs.getFile("site/wwwroot/hostingstart.html", function() {
            done();
        });
    });
    it("can list files", function(done) {
        api.vfs.listFiles("site/wwwroot", function() {
            done();
        });
    });
    it("can upload file", function(done) {
        api.vfs.uploadFile(path.join(__dirname, "test.txt"), "site/wwwroot/test.txt", function() {
            done();
        });
    });
    it("can validate an etag when uploading file", function(done) {
        api.vfs.uploadFile(path.join(__dirname, "test.txt"), "site/wwwroot/test.txt", "foo", function(err) {
            assert(err, "Should error with mismatched etag");
            done();
        });
    });
    it("can create directories", function(done) {
        api.vfs.createDirectory("site/wwwroot/test1/test2", function() {
            done();
        });
    });
    it("can delete a file", function(done) {
        api.vfs.deleteFile("site/wwwroot/test.txt", function() {
            done();
        });
    });
    it("can delete a directory", function(done) {
        api.vfs.deleteDirectory("site/wwwroot/test1/test2", function() {
            done();
        });
    });
});
