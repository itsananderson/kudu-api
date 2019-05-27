import * as fs from "fs";
import * as path from "path";

import * as utils from "./utils";
import { ApiResponse } from "./types";
import { RequestAPI, Request, CoreOptions, RequiredUriUrl } from "request";

function createUploadHeaders(localPath): { [key: string]: string } {
  var fileName = path.basename(localPath);
  var contentType =
    path.extname(localPath).toLowerCase() === ".zip"
      ? "application/zip"
      : "application/octet-stream";

  return {
    "Content-Disposition": "attachment; filename=" + fileName,
    "Content-Type": contentType
  };
}

export interface WebJob {
  name: string;
  latest_run: null | string;
  history_url: string;
  scheduler_logs_url: null | string;
  run_command: string;
  url: string;
  extra_info_url: string;
  type: string;
  error: null | "string";
  using_sdk: boolean;
  settings: {
    [key: string]: string;
  };
}

export interface TriggeredWebJobHistoryDetail {
  duration: string;
  end_time: string;
  error_url: string[];
  id: string;
  job_name: string;
  name: string;
  output_url: string;
  start_time: string;
  status: string;
  trigger: string;
  url: string;
}

export interface TriggeredWebJobHistory {
  runs: TriggeredWebJobHistoryDetail[];
}

export interface WebJobsApi {
  listAll: () => Promise<ApiResponse<WebJob[]>>;
  listTriggered: () => Promise<ApiResponse<WebJob[]>>;
  listTriggeredAsSwagger: () => Promise<ApiResponse<{ [key: string]: any }>>;
  getTriggered: (name: string) => Promise<ApiResponse<WebJob>>;
  uploadTriggered: (
    name: string,
    localPath: string
  ) => Promise<ApiResponse<WebJob>>;
  deleteTriggered: (name: string) => Promise<ApiResponse<void>>;
  runTriggered: (name: string, args?: string) => Promise<ApiResponse<void>>;
  listTriggeredHistory: (
    name: string
  ) => Promise<ApiResponse<TriggeredWebJobHistory>>;
  getTriggeredHistory: (
    name: string,
    id: string
  ) => Promise<ApiResponse<TriggeredWebJobHistoryDetail>>;
  listContinuous: () => Promise<ApiResponse<WebJob[]>>;
  getContinuous: (name: string) => Promise<ApiResponse<WebJob>>;
  uploadContinuous: (
    name: string,
    localPath: string
  ) => Promise<ApiResponse<WebJob>>;
  deleteContinuous: (name: string) => Promise<ApiResponse<void>>;
  startContinuous: (name: string) => Promise<ApiResponse<void>>;
  stopContinuous: (name: string) => Promise<ApiResponse<void>>;
  getContinuousSettings: (name: string) => Promise<ApiResponse<any>>;
  setContinuousSettings: (
    name: string,
    settings: any
  ) => Promise<ApiResponse<void>>;
}

export default function webjobs(
  request: RequestAPI<Request, CoreOptions, RequiredUriUrl>
): WebJobsApi {
  return {
    listAll: function listAll(): Promise<ApiResponse<WebJob[]>> {
      var options = {
        uri: "/api/webjobs",
        json: true
      };

      return new Promise<ApiResponse<WebJob[]>>((resolve, reject) => {
        request(
          options,
          utils.createPromiseCallback("listing all webjobs", resolve, reject)
        );
      });
    },

    listTriggered: function listTriggered(): Promise<ApiResponse<WebJob[]>> {
      var options = {
        uri: "/api/triggeredwebjobs",
        json: true
      };

      return new Promise<ApiResponse<WebJob[]>>((resolve, reject) => {
        request(
          options,
          utils.createPromiseCallback(
            "listing triggered webjobs",
            resolve,
            reject
          )
        );
      });
    },

    listTriggeredAsSwagger: function listTriggeredAsSwagger(): Promise<
      ApiResponse<string[]>
    > {
      var options = {
        uri: "/api/triggeredwebjobsswagger",
        json: true
      };

      return new Promise<ApiResponse<string[]>>((resolve, reject) => {
        request(
          options,
          utils.createPromiseCallback(
            "listing triggered webjobs as swagger",
            resolve,
            reject
          )
        );
      });
    },

    getTriggered: function getTriggered(
      name: string
    ): Promise<ApiResponse<WebJob>> {
      var options = {
        uri: "/api/triggeredwebjobs/" + encodeURIComponent(name),
        json: true
      };
      var action = "getting triggered webjob with name '" + name + "'";

      return new Promise<ApiResponse<WebJob>>((resolve, reject) => {
        request(options, utils.createPromiseCallback(action, resolve, reject));
      });
    },

    uploadTriggered: function uploadTriggered(
      name: string,
      localPath: string
    ): Promise<ApiResponse<WebJob>> {
      var options = {
        uri: "/api/triggeredwebjobs/" + encodeURIComponent(name),
        json: true,
        headers: createUploadHeaders(localPath)
      };
      var action = "uploading triggered webjob with name '" + name + "'";

      return new Promise<ApiResponse<WebJob>>((resolve, reject) => {
        fs.createReadStream(localPath)
          .on("error", e => reject(e))
          .pipe(
            request.put(
              options,
              utils.createPromiseCallback(action, resolve, reject)
            )
          );
      });
    },

    deleteTriggered: function deleteTriggered(
      name: string
    ): Promise<ApiResponse<void>> {
      var url = "/api/triggeredwebjobs/" + encodeURIComponent(name);
      var action = "deleting triggered webjob with name '" + name + "'";

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.del(url, utils.createPromiseCallback(action, resolve, reject));
      });
    },

    runTriggered: function runTriggered(
      name: string,
      args: string = undefined
    ): Promise<ApiResponse<void>> {
      var query = { arguments: args };

      var options = {
        url: "/api/triggeredwebjobs/" + encodeURIComponent(name) + "/run",
        qs: query
      };
      var action = "running triggered webjob with name '" + name + "'";

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.post(
          options,
          utils.createPromiseCallback(action, resolve, reject)
        );
      });
    },

    listTriggeredHistory: function listTriggeredHistory(
      name: string
    ): Promise<ApiResponse<TriggeredWebJobHistory>> {
      var options = {
        uri: "/api/triggeredwebjobs/" + encodeURIComponent(name) + "/history",
        json: true
      };
      var action =
        "listing history for triggered webjob with name '" + name + "'";

      return new Promise<ApiResponse<TriggeredWebJobHistory>>(
        (resolve, reject) => {
          request(
            options,
            utils.createPromiseCallback(action, resolve, reject)
          );
        }
      );
    },

    getTriggeredHistory: function getTriggeredHistory(
      name: string,
      id: string
    ): Promise<ApiResponse<TriggeredWebJobHistoryDetail>> {
      var options = {
        uri:
          "/api/triggeredwebjobs/" +
          encodeURIComponent(name) +
          "/history/" +
          encodeURIComponent(id),
        json: true
      };
      var action =
        "getting history for triggered webjob with name '" +
        name +
        "' and run id '" +
        id +
        "'";

      return new Promise<ApiResponse<TriggeredWebJobHistoryDetail>>(
        (resolve, reject) => {
          request(
            options,
            utils.createPromiseCallback(action, resolve, reject)
          );
        }
      );
    },

    listContinuous: function listContinuous(): Promise<ApiResponse<WebJob[]>> {
      var options = {
        uri: "/api/continuouswebjobs",
        json: true
      };

      return new Promise<ApiResponse<WebJob[]>>((resolve, reject) => {
        request(
          options,
          utils.createPromiseCallback(
            "listing continuous webjobs",
            resolve,
            reject
          )
        );
      });
    },

    getContinuous: function getContinuous(
      name: string
    ): Promise<ApiResponse<WebJob>> {
      var options = {
        uri: "/api/continuouswebjobs/" + encodeURIComponent(name),
        json: true
      };
      var action = "getting continuous webjob with name '" + name + "'";

      return new Promise<ApiResponse<WebJob>>((resolve, reject) => {
        request(options, utils.createPromiseCallback(action, resolve, reject));
      });
    },

    uploadContinuous: function uploadContinuous(
      name: string,
      localPath: string
    ): Promise<ApiResponse<WebJob>> {
      var options = {
        uri: "/api/continuouswebjobs/" + encodeURIComponent(name),
        json: true,
        headers: createUploadHeaders(localPath)
      };
      var action = "uploading continuous webjob with name '" + name + "'";

      return new Promise<ApiResponse<WebJob>>((resolve, reject) => {
        fs.createReadStream(localPath)
          .on("error", err => reject(err))
          .pipe(
            request.put(
              options,
              utils.createPromiseCallback(action, resolve, reject)
            )
          );
      });
    },

    deleteContinuous: function deleteContinuous(
      name: string
    ): Promise<ApiResponse<void>> {
      var url = "/api/continuouswebjobs/" + encodeURIComponent(name);
      var action = "deleting continuous webjob with name '" + name + "'";

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.del(url, utils.createPromiseCallback(action, resolve, reject));
      });
    },

    startContinuous: function startContinuous(
      name: string
    ): Promise<ApiResponse<void>> {
      var url = "/api/continuouswebjobs/" + encodeURIComponent(name) + "/start";
      var action = "starting continuous webjob with name '" + name + "'";

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.post(url, utils.createPromiseCallback(action, resolve, reject));
      });
    },

    stopContinuous: function stopContinuous(
      name: string
    ): Promise<ApiResponse<void>> {
      var url = "/api/continuouswebjobs/" + encodeURIComponent(name) + "/stop";
      var action = "stopping continuous webjob with name '" + name + "'";

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.post(url, utils.createPromiseCallback(action, resolve, reject));
      });
    },

    getContinuousSettings: function getContinuousSettings(
      name: string
    ): Promise<ApiResponse<any>> {
      var options = {
        uri: "/api/continuouswebjobs/" + encodeURIComponent(name) + "/settings",
        json: true
      };
      var action =
        "getting continuous webjob settings with name '" + name + "'";

      return new Promise<ApiResponse<{ [key: string]: string }>>(
        (resolve, reject) => {
          request.get(
            options,
            utils.createPromiseCallback(action, resolve, reject)
          );
        }
      );
    },

    setContinuousSettings: function setContinuousSettings(
      name: string,
      settings: any
    ): Promise<ApiResponse<void>> {
      var options = {
        uri: "/api/continuouswebjobs/" + encodeURIComponent(name) + "/settings",
        json: settings
      };
      var action =
        "setting continuous webjob settings with name '" + name + "'";

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.put(
          options,
          utils.createPromiseCallback(action, resolve, reject)
        );
      });
    }
  };
}
