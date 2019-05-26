import * as assert from "assert";

import * as testUtils from "./test-utils";

var api;

var gitUrl1 = "https://github.com/itsananderson/kudu-api-website.git";
var gitUrl2 =
  "https://github.com/itsananderson/kudu-api-website.git#1f19ea3b8e68397b6f7c290378526ef37975105d";

describe("deployment", function(): void {
  this.timeout(5000);

  var deploymentList;

  before(
    testUtils.setupKudu(false, function(kuduApi): void {
      api = kuduApi;
    })
  );

  before(function(done): void {
    this.timeout(30 * 1000);

    api.deployment
      .deployAsync(gitUrl1)
      .then(function(): void {
        return api.deployment.deployAsync(gitUrl2);
      })
      .then(function(): void {
        return api.deployment.listAsync();
      })
      .then(function(result): void {
        deploymentList = result.data;
        done();
      })
      .catch(done);
  });

  it("can list all deployments", function(done): void {
    api.deployment.list(function(err, result): void {
      if (err) {
        return done(err);
      }

      assert(Array.isArray(result.data), "Deployments should be an array");
      done();
    });
  });

  it("can get a single deployment", function(done): void {
    api.deployment.get(deploymentList[0].id, function(err, result): void {
      if (err) {
        return done(err);
      }

      assert.equal(
        result.data.id,
        deploymentList[0].id,
        "Deployment id should match the one queried"
      );
      done();
    });
  });

  it("can deploy a previous deployment", function(done): void {
    this.timeout(30 * 1000);

    api.deployment
      .redeployAsync(deploymentList[0].id)
      .then(function(): void {
        return api.deployment.getAsync(deploymentList[0].id);
      })
      .then(function(result): void {
        var deployment = result.data;

        assert.equal(
          deployment.id,
          deploymentList[0].id,
          "Deployment id should match the one queried"
        );
        assert(deployment.active, "Deployment should be active");
        done();
      })
      .catch(done);
  });

  it("can delete a deployment", function(done): void {
    var oldDeployments;

    api.deployment
      .listAsync()
      .then(function(result): void {
        oldDeployments = result.data;
        var deploymentId = oldDeployments.filter(function(d): boolean {
          return !d.active;
        })[0].id;

        return api.deployment.delAsync(deploymentId);
      })
      .then(function(): void {
        return api.deployment.listAsync();
      })
      .then(function(result): void {
        assert.equal(
          result.data.length,
          oldDeployments.length - 1,
          "Deployment count should be one less after deletion"
        );
        done();
      })
      .catch(done);
  });

  it("can get a deployment log", function(done): void {
    api.deployment.log(deploymentList[0].id, function(err, result): void {
      if (err) {
        return done(err);
      }

      assert(
        Array.isArray(result.data),
        "Deployment log entries should be an array"
      );
      done();
    });
  });

  it("can get a deployment log entry", function(done): void {
    var deploymentId = deploymentList[0].id;

    api.deployment
      .logAsync(deploymentId)
      .then(function(result): void {
        var entry = result.data.filter(function(entry): boolean {
          return !!entry.details_url;
        })[0];

        return api.deployment.logDetailsAsync(deploymentId, entry.id);
      })
      .then(function(result): void {
        assert(result.data);
        done();
      })
      .catch(done);
  });
});
