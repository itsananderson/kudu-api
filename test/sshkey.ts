"use strict";

var assert = require("assert");
var testUtils = require("./test-utils");
var api;

describe("sshkey", function () {
    this.timeout(5000);

    before(testUtils.setupKudu(function (kuduApi) {
        api = kuduApi;
    }));

    it("can generate a new key if none exists", function (done) {
        api.sshkey.get(true, function (err, result) {
            assert(/^ssh-rsa/.test(result.data), "Should be a valid key");
            done(err);
        });
    });

    it("can download key", function (done) {
        api.sshkey.get(function (err, result) {
            assert(/^ssh-rsa/.test(result.data), "Should be a valid key");
            done(err);
        });
    });
});
