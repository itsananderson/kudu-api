import * as request from "request";

import scm from "./lib/scm";
import command from "./lib/command";
import vfs from "./lib/vfs";
import zip from "./lib/zip";
import deployment from "./lib/deployment";
import sshkey from "./lib/sshkey";
import environment from "./lib/environment";
import settings from "./lib/settings";
import dump from "./lib/dump";
import diagnostics from "./lib/diagnostics";
import logs from "./lib/logs";
import extensions from "./lib/extensions";
import webjobs from "./lib/webjobs";

export interface KuduApi {
  scm: ReturnType<typeof scm>;
  command: ReturnType<typeof command>;
  vfs: ReturnType<typeof vfs>;
  zip: ReturnType<typeof zip>;
  deployment: ReturnType<typeof deployment>;
  sshkey: ReturnType<typeof sshkey>;
  environment: ReturnType<typeof environment>;
  settings: ReturnType<typeof settings>;
  dump: ReturnType<typeof dump>;
  diagnostics: ReturnType<typeof diagnostics>;
  logs: ReturnType<typeof logs>;
  extensions: ReturnType<typeof extensions>;
  webjobs: ReturnType<typeof webjobs>;
}

export default function api(options): KuduApi {
  // Backward compat for old method signature
  if (typeof options === "string") {
    options = {
      website: options,
      username: arguments[1],
      password: arguments[2]
    };
  }

  //option: domain - in case the kudu api doesn't run on azurewebsites
  var domain = options.domain || "scm.azurewebsites.net";

  //options: website, username, password, basic (hashed)
  var website = options.website;
  var headers: {
    Authorization?: string;
  } = {};

  if (options.username && options.password) {
    headers.Authorization =
      "Basic " +
      new Buffer(options.username + ":" + options.password).toString("base64");
  }

  if (options.basic) {
    headers.Authorization = "Basic " + options.basic;
  }

  var r = request.defaults({
    baseUrl: "https://" + website + "." + domain + "/",
    headers: headers
  });

  return {
    scm: scm(r),
    command: command(r),
    vfs: vfs(r),
    zip: zip(r),
    deployment: deployment(r),
    sshkey: sshkey(r),
    environment: environment(r),
    settings: settings(r),
    dump: dump(r),
    diagnostics: diagnostics(r),
    logs: logs(r),
    extensions: extensions(r),
    webjobs: webjobs(r)
  };
}
