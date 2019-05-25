import * as assert from "assert";

import * as testUtils from "./test-utils";

var api;

describe("logs", function(): void {
    this.timeout(5000);

    before(testUtils.setupKudu(false, function (kuduApi): void {
        api = kuduApi;
    }));

    it("can retrieve recent logs", function(done): void {
        api.logs.recent(function(err, result): void {
            if (err) {
                done(err);
                return;
            }

            assert(Array.isArray(result.data), "logs should be an array");
            done();
        });
    });

    it("can retrieve custom number of recent logs", function(done): void {
        var query = {
            top: 500
        };

        api.logs.recent(query, function(err, result): void {
            if (err) {
                done(err);
                return;
            }

            assert(Array.isArray(result.data), "logs should be an array");
            done();
        });
    });
});
