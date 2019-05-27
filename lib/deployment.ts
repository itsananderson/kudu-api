import * as utils from "./utils";
import { RequestAPI, Request, CoreOptions, RequiredUriUrl } from "request";
import { ApiResponse } from "./types";

export interface DeploymentApi {
  list: () => Promise<ApiResponse<Deployment[]>>;
  get: (id: string) => Promise<ApiResponse<Deployment>>;
  del: (id: string) => Promise<ApiResponse<void>>;
  log: (id: string) => Promise<ApiResponse<DeploymentLogEntry[]>>;
  logDetails: (
    id: string,
    entryId: string
  ) => Promise<ApiResponse<DeploymentLogEntry>>;
  deploy: (repoUrl: string) => Promise<ApiResponse<void>>;
  redeploy: (id: string, payload?: {}) => Promise<ApiResponse<void>>;
}

export interface Deployment {
  id: string;
  active: boolean;
}

export interface DeploymentLogEntry {
  log_time: string;
  id: string;
  message: string;
  type: number;
  details_url: null | string;
}

export default function deployment(
  request: RequestAPI<Request, CoreOptions, RequiredUriUrl>
): DeploymentApi {
  return {
    list: function list(): Promise<ApiResponse<Deployment[]>> {
      var options = {
        uri: "/api/deployments/",
        json: true
      };

      return new Promise<ApiResponse<Deployment[]>>((resolve, reject) => {
        request(
          options,
          utils.createPromiseCallback<Deployment[]>(
            "listing deployments",
            resolve,
            reject
          )
        );
      });
    },

    get: function get(id): Promise<ApiResponse<Deployment>> {
      var options = {
        uri: "/api/deployments/" + encodeURIComponent(id),
        json: true
      };
      var action = "getting deployment with id " + id;

      return new Promise<ApiResponse<Deployment>>((resolve, reject) => {
        request(
          options,
          utils.createPromiseCallback<Deployment>(action, resolve, reject)
        );
      });
    },

    del: function del(id): Promise<ApiResponse<void>> {
      var url = "/api/deployments/" + encodeURIComponent(id);
      var action = "deleting deployment with id " + id;

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.del(
          url,
          utils.createPromiseCallback<void>(action, resolve, reject)
        );
      });
    },

    log: function log(id: string): Promise<ApiResponse<DeploymentLogEntry[]>> {
      var options = {
        uri: "/api/deployments/" + encodeURIComponent(id) + "/log",
        json: true
      };
      var action = "listing logs for deployment with id " + id;

      return new Promise<ApiResponse<DeploymentLogEntry[]>>(
        (resolve, reject) => {
          request(
            options,
            utils.createPromiseCallback(action, resolve, reject)
          );
        }
      );
    },

    logDetails: function logDetails(
      id: string,
      entryId: string
    ): Promise<ApiResponse<DeploymentLogEntry>> {
      var options = {
        uri:
          "/api/deployments/" +
          encodeURIComponent(id) +
          "/log/" +
          encodeURIComponent(entryId),
        json: true
      };
      var action =
        "getting log details with log id " + id + " and entry id " + entryId;

      return new Promise<ApiResponse<DeploymentLogEntry>>((resolve, reject) => {
        request(options, utils.createPromiseCallback(action, resolve, reject));
      });
    },

    deploy: function deploy(repoUrl: string): Promise<ApiResponse<void>> {
      var options = {
        uri: "/deploy/",
        json: {
          format: "basic",
          url: repoUrl
        }
      };
      var action = "triggering a deployment from the repository " + repoUrl;

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.post(
          options,
          utils.createPromiseCallback<void>(action, resolve, reject)
        );
      });
    },

    redeploy: function redeploy(
      id: string,
      payload: {}
    ): Promise<ApiResponse<void>> {
      var options = {
        uri: "/api/deployments/" + encodeURIComponent(id),
        json: payload || {}
      };
      var action = "triggering a redeployment with id " + id;

      return new Promise<ApiResponse<void>>((resolve, reject) => {
        request.put(
          options,
          utils.createPromiseCallback<void>(action, resolve, reject)
        );
      });
    }
  };
}
