import * as assert from "assert";
import * as fs from "fs";

import * as testUtils from "./test-utils";
import { KuduApi } from "../index";

let api: KuduApi;

const triggeredFiles = {
  "run.cmd": "echo hello world %*",
};
const continuousFiles = {
  "run.js":
    "console.log(process.argv.join(' ')); setInterval(() => console.log('ping'), 30000);",
};

describe("webjobs", function (): void {
  this.timeout(10 * 1000);

  before(
    testUtils.setupKudu(false, (kuduApi: KuduApi): void => {
      api = kuduApi;
    })
  );

  before(testUtils.ensureArtifacts);

  describe("triggered basic operations", function (): void {
    const jobName = "triggered-job-1";
    const localPath = testUtils.artifactPath(jobName + ".zip");

    before(async function (): Promise<void> {
      await testUtils.createZipFileAsync(localPath, triggeredFiles);

      await api.webjobs.uploadTriggered(jobName, localPath);

      const retries = 10;
      for (let i = 0; i < retries; i++) {
        const response = await api.webjobs.listAll();
        if (response.payload.length > 0) {
          // found an uploaded webjob
          return;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      assert.fail(
        `Failed to find an uploaded webjob after ${retries} attempts`
      );
    });

    after(async function (): Promise<void> {
      await api.webjobs.deleteTriggered(jobName);
      fs.unlinkSync(localPath);
    });

    it("can list all webjobs", async function (): Promise<void> {
      const response = await api.webjobs.listAll();

      assert.strictEqual(
        response.payload.length,
        1,
        "Web job list should contain one entry."
      );
    });

    it("can list triggered webjobs", async function (): Promise<void> {
      const response = await api.webjobs.listTriggered();

      assert.strictEqual(
        response.payload.length,
        1,
        "Triggered job list should contain one entry."
      );
    });

    it("can list triggered webjobs as swagger", async function (): Promise<void> {
      const response = await api.webjobs.listTriggeredAsSwagger();

      assert.strictEqual(
        response.payload.swagger,
        "2.0",
        "Triggered job list as swagger should have expected version."
      );
    });

    it("can get triggered webjob by name", async function (): Promise<void> {
      const response = await api.webjobs.getTriggered(jobName);

      assert.strictEqual(
        response.payload.name,
        jobName,
        "Triggered job data does not contain correct name."
      );
    });

    it("should report error getting unknown triggered webjob", async function (): Promise<void> {
      try {
        await api.webjobs.getTriggered("unknown-job");
        assert.fail("Requesting an unknown job should have failed");
      } catch (err) {
        assert.strictEqual(
          err.rawResponse.statusCode,
          404,
          "Unknown triggered job error should contain status code."
        );
      }
    });

    it("can run triggered webjob", async function (): Promise<void> {
      const response = await api.webjobs.runTriggered(jobName);
      assert.strictEqual(response.rawResponse.statusCode, 202);
    });

    it("should report error running unknown triggered webjob", async function (): Promise<void> {
      try {
        const response = await api.webjobs.runTriggered("unknown-job");
        assert.fail("Expected error was not thrown.");
      } catch (err) {
        assert.strictEqual(
          err.rawResponse.statusCode,
          404,
          "Unknown triggered job error should contain status code."
        );
      }
    });

    it("can run triggered webjob with arguments", async function (): Promise<void> {
      const response = await api.webjobs.runTriggered(
        jobName,
        '--message "Kudu\'s API"'
      );

      assert.strictEqual(response.rawResponse.statusCode, 202);
    });

    it("can list triggered webjob history", async function (): Promise<void> {
      const response = await api.webjobs.listTriggeredHistory(jobName);

      assert(
        Array.isArray(response.payload.runs),
        "History list for triggered job should contain runs."
      );
    });

    it("can get triggered webjob history item by id", async function (): Promise<void> {
      const response = await api.webjobs.listTriggeredHistory(jobName);

      const detailResponse = await api.webjobs.getTriggeredHistory(
        jobName,
        response.payload.runs[0].id
      );
      assert.strictEqual(
        detailResponse.payload.output_url.slice(-4),
        ".txt",
        "History for triggered job should contain text output URL."
      );
    });
  });

  describe("triggered upload", function (): void {
    const jobName = "triggered-job-2";
    const localPath = testUtils.artifactPath(jobName + ".zip");

    before((done): void => {
      testUtils.createZipFile(localPath, triggeredFiles, done);
    });

    after((done): void => {
      fs.unlink(localPath, done);
    });

    afterEach(async function (): Promise<void> {
      try {
        await api.webjobs.deleteTriggered(jobName);
      } catch (e) {
        // Ignore errors.
      }
    });

    it("can upload triggered webjob", async function (): Promise<void> {
      const response = await api.webjobs.uploadTriggered(jobName, localPath);

      assert.strictEqual(
        response.rawResponse.statusCode,
        200,
        "Should respond with OK status code."
      );
      assert.strictEqual(
        response.payload.type,
        "triggered",
        "Should have correct type."
      );
    });
  });

  describe("triggered delete", function (): void {
    const jobName = "triggered-job-3";
    const localPath = testUtils.artifactPath(jobName + ".zip");

    before((done): void => {
      testUtils.createZipFile(localPath, triggeredFiles, done);
    });

    after((done): void => {
      fs.unlink(localPath, done);
    });

    beforeEach(async function (): Promise<void> {
      await api.webjobs.uploadTriggered(jobName, localPath);
    });

    afterEach(async function (): Promise<void> {
      await api.webjobs.deleteTriggered(jobName);
    });

    it("can delete triggered webjob", async function (): Promise<void> {
      const response = await api.webjobs.deleteTriggered(jobName);

      assert.strictEqual(
        response.rawResponse.statusCode,
        200,
        "Should respond with OK status code."
      );

      try {
        await api.webjobs.getTriggered(jobName);
        assert.fail("Expected error was not thrown.");
      } catch (err) {
        assert.strictEqual(
          err.rawResponse.statusCode,
          404,
          "Deleted triggered job should be not found."
        );
      }
    });
  });

  describe("continuous basic operations", function (): void {
    const jobName = "continuous-job-1";
    const localPath = testUtils.artifactPath(jobName + ".zip");

    before(async function (): Promise<void> {
      await testUtils.createZipFileAsync(localPath, continuousFiles);

      await api.webjobs.uploadContinuous(jobName, localPath);
      const retries = 10;
      for (let i = 0; i < retries; i++) {
        const response = await api.webjobs.listAll();
        if (response.payload.length > 0) {
          // found an uploaded webjob
          return;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
      assert.fail(
        `Failed to find an uploaded webjob after ${retries} attempts`
      );
    });

    after(
      async (): Promise<void> => {
        await api.webjobs.deleteContinuous(jobName);
        fs.unlinkSync(localPath);
      }
    );

    it("can list continuous webjobs", async function (): Promise<void> {
      const response = await api.webjobs.listContinuous();

      assert.strictEqual(
        response.payload.length,
        1,
        "Continuous job list should contain one entry."
      );
    });

    it("can get continuous webjob by name", async function (): Promise<void> {
      const response = await api.webjobs.getContinuous(jobName);

      assert.strictEqual(
        response.payload.name,
        jobName,
        "Continuous job should have correct name."
      );
    });

    it("can stop continuous webjob by name", async function (): Promise<void> {
      const response = await api.webjobs.stopContinuous(jobName);

      assert.strictEqual(
        response.rawResponse.statusCode,
        200,
        "Should respond with OK status code."
      );
    });

    it("can start continuous webjob by name", async function (): Promise<void> {
      const response = await api.webjobs.startContinuous(jobName);
      assert.strictEqual(
        response.rawResponse.statusCode,
        200,
        "Should respond with OK status code."
      );
    });

    it("can get continuous webjob settings", async function (): Promise<void> {
      const response = await api.webjobs.getContinuousSettings(jobName);

      assert(
        !response.payload.is_singleton,
        "Singleton setting should be false."
      );
    });

    it("can set continuous webjob settings", async function (): Promise<void> {
      const settings = {
        is_singleton: false,
      };

      const response = await api.webjobs.setContinuousSettings(
        jobName,
        settings
      );

      assert.strictEqual(
        response.rawResponse.statusCode,
        200,
        "Should respond with OK status code."
      );
    });
  });

  describe("continuous upload", function (): void {
    const jobName = "continuous-job-2";
    const localPath = testUtils.artifactPath(jobName + ".zip");

    before(function (done): void {
      testUtils.createZipFile(localPath, continuousFiles, done);
    });

    after(function (done): void {
      fs.unlink(localPath, done);
    });

    afterEach(async function (): Promise<void> {
      try {
        await api.webjobs.deleteContinuous(jobName);
      } catch (err) {
        // Ignore errors
      }
    });

    it("can upload continuous webjob", async function (): Promise<void> {
      const response = await api.webjobs.uploadContinuous(jobName, localPath);

      assert.strictEqual(
        response.rawResponse.statusCode,
        200,
        "Should respond with OK status code."
      );
      assert.strictEqual(
        response.payload.type,
        "continuous",
        "Should have correct type."
      );
    });
  });

  describe("continuous delete", function (): void {
    const jobName = "continuous-job-3";
    const localPath = testUtils.artifactPath(jobName + ".zip");

    before(function (done): void {
      testUtils.createZipFile(localPath, continuousFiles, done);
    });

    after(function (done): void {
      fs.unlink(localPath, done);
    });

    beforeEach(async function (): Promise<void> {
      await api.webjobs.uploadContinuous(jobName, localPath);
    });

    afterEach(async function (): Promise<void> {
      await api.webjobs.deleteContinuous(jobName);
    });

    it("can delete continuous webjob", async function (): Promise<void> {
      const response = await api.webjobs.deleteContinuous(jobName);
      assert.strictEqual(
        response.rawResponse.statusCode,
        200,
        "Should respond with OK status code."
      );

      try {
        await api.webjobs.getContinuous(jobName);
        assert.fail("Getting deleted webjob should throw an error");
      } catch (err) {
        assert.strictEqual(
          err.rawResponse.statusCode,
          404,
          "Deleted continuous job should be not found."
        );
      }
    });
  });
});
