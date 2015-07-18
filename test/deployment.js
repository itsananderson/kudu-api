var fs = require("fs");
var path = require("path");
var api = require("../")(process.env.WEBSITE, process.env.USERNAME, process.env.PASSWORD);
var exec = require("child_process").exec;

var gitUrl1 = "https://github.com/itsananderson/itsananderson.github.io.git";
var gitUrl2 = "https://github.com/itsananderson/itsananderson.github.io.git#402dce250fc649e52b201aaca24de08c353dac75";

describe("deployment", function() {
    this.timeout(5000);

    var deploymentList;

    before(function(done) {
        this.timeout(30 * 1000);
        api.deployment.deploy(gitUrl1, function(err, result) {
            api.deployment.deploy(gitUrl2, function(err, result) {
                api.deployment.list(function(err, deployments) {
                    deploymentList = deployments; 
                    done();
                });
            });
        });
    });

    it("can list all deployments", function(done) {
        done();
    });
    it("can get a single deployment", function(done) {
        api.deployment.get(deploymentList[0].id, function(err, deployment) {
            done();
        });
    });
    it("can deploy a previous deployment", function(done) {
        this.timeout(30 * 1000);
        api.deployment.redeploy(deploymentList[0].id, function(err, result) {
            done();
        });
    });
    it("can delete a deployment", function(done) {
        var deploymentId = deploymentList.filter(function(d) {
            return !d.active;
        })[0].id;
        api.deployment.del(deploymentId, function(err, result) {
            done();
        });
    });
    it("can get a deployment log", function(done) {
        api.deployment.log(deploymentList[0].id, function(err, entries) {
            done();
        });
    });
    it("can get a deployment log entry", function(done) {
        var deploymentId = deploymentList[0].id;
        api.deployment.log(deploymentId, function(err, entries) {
            var entry = entries.filter(function(entry) {
                return !!entry.details_url;
            })[0];
            api.deployment.logDetails(deploymentId, entry.id, function(err, details) {
                done();
            });
        });
    });
});
