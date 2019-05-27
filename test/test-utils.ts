import * as fs from "fs";
import * as path from "path";

import * as aps from "azure-publish-settings";
import * as JSZip from "jszip";

import kuduApi from "../";

var artifactRoot = path.join(__dirname, "artifacts");

export function ensureArtifacts(done): void {
  fs.mkdir(artifactRoot, function(err): void {
    if (err && err.code !== "EEXIST") {
      return done(err);
    }

    done();
  });
}

export function artifactPath(relativePath): string {
  return path.join(artifactRoot, relativePath);
}

export function createZipFile(localPath, files, cb): void {
  var generateOptions = {
    type: "nodebuffer",
    streamFiles: true
  };

  var zip = new JSZip();

  Object.keys(files).forEach(function(key): void {
    zip.file(key, files[key]);
  });

  zip
    .generateNodeStream(generateOptions)
    .pipe(fs.createWriteStream(localPath))
    .on("error", cb)
    .on("finish", cb);
}

export function createZipFileAsync(localPath, files): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        createZipFile(localPath, files, (err): void => {
            if (err) {
                reject(err);
                return
            }

            resolve();
        });
    });
}

interface Credentials {
  website: string;
  username: string;
  password: string;
  domain: string;
}

export function ensureCredentials(
  basic: boolean,
  credentials: Credentials
): Credentials | { website: string; basic: string } {
  if (!basic) {
    return credentials;
  }

  var basicCredentials = new Buffer(
    credentials.username + ":" + credentials.password
  ).toString("base64");

  return {
    website: credentials.website,
    basic: basicCredentials
  };
}

export function setupKudu(basic, cb): (done) => void {
  if (typeof basic === "function") {
    cb = basic;
    basic = false;
  }

  return function(done): void {
    var env = process.env;
    var credentials;

    if (env.WEBSITE && env.USERNAME && env.PASSWORD) {
      credentials = ensureCredentials(basic, {
        website: env.WEBSITE,
        username: env.USERNAME,
        password: env.PASSWORD,
        domain: env.DOMAIN
      });

      cb(kuduApi(credentials));

      return done();
    }

    var settingsPath = path.join(__dirname, "test.PublishSettings");

    aps.read(settingsPath, function(err, settings): void {
      if (err) {
        if (err.code === "ENOENT") {
          return done(
            new Error(
              'A "test.PublishSettings" file was not found in the test directory. Please provide one or add WEBSITE, USERNAME and PASSWORD environment variables to enable kudu-api testing.'
            )
          );
        }

        return done(err);
      }

      // Put site name into an environment variable for the tests that need it
      env.WEBSITE = settings.name;

      credentials = ensureCredentials(basic, settings.kudu);
      cb(kuduApi(credentials));

      done();
    });
  };
}
