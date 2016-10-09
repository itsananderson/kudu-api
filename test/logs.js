"use strict";

var assert = require("assert");
var testUtils = require("./test-utils");
var api;

describe("logs", function() {
    this.timeout(5000);

    before(testUtils.setupKudu(function (kuduApi) {
        api = kuduApi;
    }));

    it("can retrieve recent logs", function(done) {
        api.logs.recent(function(err, result) {
            if (err) {
                return done(err);
            }

            assert(Array.isArray(result.data), "logs should be an array");
            done();
        });
    });

    it("can retrieve custom number of recent logs", function(done) {
        var query = {
            top: 500
        };

        api.logs.recent(query, function(err, result) {
            if (err) {
                return done(err);
            }

            assert(Array.isArray(result.data), "logs should be an array");
            done();
        });
    });
});
