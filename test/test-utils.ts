"use strict";

var JSZip = require("jszip");
var fs = require("fs");
var aps = require("azure-publish-settings");
var path = require("path");
var Promise = require("bluebird");
var kuduApi = require("../");

var artifactRoot = path.join(__dirname, "artifacts");

function ensureArtifacts(done) {
    fs.mkdir(artifactRoot, function (err) {
        if (err && err.code !== "EEXIST") {
            return done(err);
        }

        done();
    });
}

function artifactPath(relativePath) {
    return path.join(artifactRoot, relativePath);
}

function createZipFile(localPath, files, cb) {
    var generateOptions = {
        type: "nodebuffer",
        streamFiles: true
    };

    var zip = new JSZip();

    Object.keys(files).forEach(function (key) {
        zip.file(key, files[key]);
    });

    zip.generateNodeStream(generateOptions)
        .pipe(fs.createWriteStream(localPath))
        .on("error", cb)
        .on("finish", cb);
}

var createZipFileAsync = Promise.promisify(createZipFile);

function ensureCredentials(basic, credentials) {
    if (!basic) {
        return credentials;
    }

    var basicCredentials = new Buffer(credentials.username + ":" + credentials.password).toString("base64");

    return {
        website: credentials.website,
        basic: basicCredentials
    };
}

function setupKudu(basic, cb) {
    if (typeof basic === "function") {
        cb = basic;
        basic = false;
    }

    return function (done) {
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

        aps.read(settingsPath, function (err, settings) {
            if (err) {
                if (err.code === "ENOENT") {
                    return done(new Error("A \"test.PublishSettings\" file was not found in the test directory. Please provide one or add WEBSITE, USERNAME and PASSWORD environment variables to enable kudu-api testing."));
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

module.exports = {
    ensureArtifacts: ensureArtifacts,
    artifactPath: artifactPath,
    createZipFile: createZipFile,
    createZipFileAsync: createZipFileAsync,
    setupKudu: setupKudu
};
