var api = require("../")(process.env.WEBSITE, process.env.USERNAME, process.env.PASSWORD);

describe("scm", function() {
    this.timeout(5000);

    it("can retrieve info", function(done) {
        api.scm.info(function() {
            done();
        });
    });
    it("can clean repo", function(done) {
        api.scm.clean(function() {
            done();
        });
    });
    it("can delete repo", function(done) {
        api.scm.del(done);
    });
});
