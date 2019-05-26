import * as assert from "assert";

import * as testUtils from "./test-utils";
import { Deployment } from "../lib/deployment";

var api;

var gitUrl1 = "https://github.com/itsananderson/kudu-api-website.git";
var gitUrl2 =
  "https://github.com/itsananderson/kudu-api-website.git#1f19ea3b8e68397b6f7c290378526ef37975105d";

describe("deployment", function(): void {
  this.timeout(5000);

  var deploymentList: Deployment[];

  before(
    testUtils.setupKudu(false, function(kuduApi): void {
      api = kuduApi;
    })
  );

  before(async function(): Promise<void> {
    this.timeout(30 * 1000);

    await api.deployment.deploy(gitUrl1);
    await api.deployment.deploy(gitUrl2);
    const response = await api.deployment.list();
    deploymentList = response.payload;
  });

  it("can list all deployments", async function(): Promise<void> {
    const response = await api.deployment.list();
    assert(Array.isArray(response.payload), "Deployments should be an array");
  });

  it("can get a single deployment", async function(): Promise<void> {
    const response = await api.deployment.get(deploymentList[0].id);

    assert.equal(
      response.payload.id,
      deploymentList[0].id,
      "Deployment id should match the one queried"
    );
  });

  it("can deploy a previous deployment", async function(): Promise<void> {
    this.timeout(30 * 1000);

    await api.deployment.redeploy(deploymentList[0].id);

    const response = await api.deployment.get(deploymentList[0].id);
    const deployment: Deployment = response.payload;
    assert.equal(
      deployment.id,
      deploymentList[0].id,
      "Deployment id should match the one queried"
    );
    assert(deployment.active, "Deployment should be active");
  });

  it("can delete a deployment", async function(): Promise<void> {
    const response = await api.deployment.list();
    const initialDeployments = response.payload;
    const deploymentId = initialDeployments.filter(function(d): boolean {
      return !d.active;
    })[0].id;

    await api.deployment.del(deploymentId);

    const response2 = await api.deployment.list();
    assert.equal(
      response2.payload.length,
      initialDeployments.length - 1,
      "Deployment count should be one less after deletion"
    );
  });

  it("can get a deployment log", async function(): Promise<void> {
    const response = await api.deployment.log(deploymentList[0].id);

    assert(
      Array.isArray(response.payload),
      "Deployment log entries should be an array"
    );
  });

  it("can get a deployment log entry", async function(): Promise<void> {
    var deploymentId = deploymentList[0].id;

    const response = await api.deployment.log(deploymentId);

    var entry = response.payload.filter(function(entry): boolean {
      return !!entry.details_url;
    })[0];

    const detailsResponse = await api.deployment.logDetails(
      deploymentId,
      entry.id
    );
    assert(detailsResponse.payload);
  });
});
