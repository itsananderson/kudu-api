"use strict";

var JSZip = require("jszip");
var fs = require("fs");
var aps = require("azure-publish-settings");
var path = require("path");
var kuduApi = require("../");

function ensureArtifacts(done) {
    fs.mkdir("test/artifacts", function (err) {
        if (err && err.code !== "EEXIST") {
            return done(err);
        }

        done();
    });
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

function setupKudu(cb) {
    return function (done) {
        var env = process.env;

        if (env.WEBSITE) {
            cb(kuduApi({
                website: env.WEBSITE,
                username: env.USERNAME,
                password: env.PASSWORD
            }));

            return done();
        }

        var settingsPath = path.join(__dirname, "test.PublishSettings");

        aps.read(settingsPath, function (err, settings) {
            if (err) {
                return done(err);
            }

            cb(kuduApi({
                website: settings.name,
                username: settings.web.username,
                password: settings.web.password
            }));

            done();
        });
    }
}

module.exports = {
    ensureArtifacts: ensureArtifacts,
    createZipFile: createZipFile,
    setupKudu: setupKudu
};
