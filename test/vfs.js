var assert = require("assert");
var path = require("path");
var api = require("../")({website: process.env.WEBSITE, username: process.env.USERNAME, password: process.env.PASSWORD});

describe("vfs", function() {
    this.timeout(5000);

    before(function(done) {
        api.vfs.uploadFile(path.join(__dirname, "test.txt"), "site/wwwroot/test.txt", done);
    });

    it("can get a file", function(done) {
        api.vfs.getFile("site/wwwroot/test.txt", function(err, content) {
            if (err) done(err);

            assert.equal(content, "test\n", "File content should be 'test\\n'");
            done();
        });
    });
    it("can list files", function(done) {
        api.vfs.listFiles("site/wwwroot", function(err, fileList) {
            if (err) done(err);

            assert.equal(typeof fileList.length, "number", "File list should be an array with valid length");
            done();
        });
    });
    it("can upload file", function(done) {
        api.vfs.uploadFile(path.join(__dirname, "test.txt"), "site/wwwroot/test.txt", done);
    });
    it("can validate an etag when uploading file", function(done) {
        api.vfs.uploadFile(path.join(__dirname, "test.txt"), "site/wwwroot/test.txt", "foo", function(err) {
            assert(err, "Should error with mismatched etag");
            done();
        });
    });
    it("can upload a file with a matching etag", function(done) {
        api.vfs.getFile("site/wwwroot/test.txt", function(err, file, response) {
            var etag = response.headers.etag;
            api.vfs.uploadFile(path.join(__dirname, "test.txt"), "site/wwwroot/test.txt", etag, function(err) {
                done(err);
            });
        });
    });
    it("can create directories", function(done) {
        api.vfs.createDirectory("site/wwwroot/test1/test2", done);
    });
    it("can delete a file", function(done) {
        api.vfs.deleteFile("site/wwwroot/test.txt", done);
    });
    it("can delete a directory", function(done) {
        api.vfs.deleteDirectory("site/wwwroot/test1/test2", done);
    });
});
