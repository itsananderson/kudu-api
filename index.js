var request = require("request");
var scm = require("./lib/scm");
var command = require("./lib/command");
var vfs = require("./lib/vfs");
var zip = require("./lib/zip");
var deployment = require("./lib/deployment");
var sshkey = require("./lib/sshkey");
var environment = require("./lib/environment");
var settings = require("./lib/settings");
var dump = require("./lib/dump");
var diagnostics = require("./lib/diagnostics");
var logs = require("./lib/logs");
var extensions = require("./lib/extensions");

module.exports = function api(website, username, password) {
    var r = request.defaults({
        baseUrl: "https://" + website + ".scm.azurewebsites.net/",
        auth: {
            username: username,
            password: password
        }
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
        extensions: extensions(r)
    };
};
