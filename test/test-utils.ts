import * as fs from "fs";
import * as path from "path";

import * as aps from "azure-publish-settings";
import * as JSZip from "jszip";

import kuduApi from "../index";
import { KuduApi, KuduOptions } from "../index";
import { Settings as AzurePublishSettings } from "../types/azure-publish-settings";

const artifactRoot = path.join(__dirname, "artifacts");

export function ensureArtifacts(done: (err?: unknown) => void): void {
  fs.mkdir(artifactRoot, function (err): void {
    if (err && err.code !== "EEXIST") {
      return done(err);
    }

    done();
  });
}

export function artifactPath(relativePath: string): string {
  return path.join(artifactRoot, relativePath);
}

export function createZipFile(
  localPath: string,
  files: { [source: string]: string },
  cb: (err: unknown) => void
): void {
  const generateOptions: JSZip.JSZipGeneratorOptions<"nodebuffer"> = {
    type: "nodebuffer",
    streamFiles: true,
  };

  const zip = new JSZip();

  Object.keys(files).forEach(function (key): void {
    zip.file(key, files[key]);
  });

  zip
    .generateNodeStream(generateOptions)
    .pipe(fs.createWriteStream(localPath))
    .on("error", cb)
    .on("finish", cb);
}

export function createZipFileAsync(
  localPath: string,
  files: { [key: string]: string }
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    createZipFile(localPath, files, (err): void => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

export function ensureCredentials(
  basic: boolean,
  credentials: KuduOptions
): KuduOptions {
  if (!basic) {
    return credentials;
  }

  const basicCredentials = new Buffer(
    credentials.username + ":" + credentials.password
  ).toString("base64");

  return {
    website: credentials.website,
    basic: basicCredentials,
  };
}

export function setupKudu(
  basic: boolean,
  cb: (api: KuduApi) => void
): (done: (err?: unknown) => void) => void {
  if (typeof basic === "function") {
    cb = basic;
    basic = false;
  }

  return function (done): void {
    const env = process.env;
    let options: KuduOptions;

    if (env.WEBSITE && env.USERNAME && env.PASSWORD) {
      options = ensureCredentials(basic, {
        website: env.WEBSITE,
        username: env.USERNAME,
        password: env.PASSWORD,
        domain: env.DOMAIN,
      });

      cb(kuduApi(options));

      return done();
    }

    const settingsPath = path.join(__dirname, "test.PublishSettings");

    aps.read(
      settingsPath,
      function (err: unknown, settings: AzurePublishSettings): void {
        if (err) {
          console.log(err);
          if (err instanceof Object) {
            const typedError = err as { code?: string };
            if (typedError.code && typedError.code === "ENOENT") {
              return done(
                new Error(
                  'A "test.PublishSettings" file was not found in the test directory. Please provide one or add WEBSITE, USERNAME and PASSWORD environment variables to enable kudu-api testing.'
                )
              );
            }
          }

          return done(err);
        }

        // Put site name into an environment variable for the tests that need it
        env.WEBSITE = settings.name;

        options = ensureCredentials(basic, settings.kudu);
        cb(kuduApi(options));

        done();
      }
    );
  };
}
