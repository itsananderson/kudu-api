import * as fs from "fs";
import * as path from "path";

import * as utils from "./utils";

function createUploadHeaders(localPath): { [key: string]: string } {
    var fileName = path.basename(localPath);
    var contentType = path.extname(localPath).toLowerCase() === ".zip"
        ? "application/zip"
        : "application/octet-stream";

    return {
        "Content-Disposition": "attachment; filename=" + fileName,
        "Content-Type": contentType
    };
}

export interface WebJobs {
    listAll: (cb) => void;
    listTriggered: (cb) => void;
    listTriggeredAsSwagger: (cb) => void;
    getTriggered: (name, cb) => void;
    uploadTriggered: (name, localPath, cb) => void;
    deleteTriggered: (name, cb) => void;
    runTriggered: (name, args, cb) => void;
    listTriggeredHistory: (name, cb) => void;
    getTriggeredHistory: (name, id, cb) => void;
    listContinuous: (cb) => void;
    getContinuous: (name, cb) => void;
    uploadContinuous: (name, localPath, cb) => void;
    deleteContinuous: (name, cb) => void;
    startContinuous: (name, cb) => void;
    stopContinuous: (name, cb) => void;
    getContinuousSettings: (name, cb) => void;
    setContinuousSettings: (name, settings, cb) => void;
}

export default function webjobs(request): WebJobs {
    return {
        listAll: function listAll(cb): void {
            var options = {
                uri: "/api/webjobs",
                json: true
            };

            request(options, utils.createCallback("listing all webjobs", cb));
        },

        listTriggered: function listTriggered(cb): void {
            var options = {
                uri: "/api/triggeredwebjobs",
                json: true
            };

            request(options, utils.createCallback("listing triggered webjobs", cb));
        },

        listTriggeredAsSwagger: function listTriggeredAsSwagger(cb): void {
            var options = {
                uri: "/api/triggeredwebjobsswagger",
                json: true
            };

            request(options, utils.createCallback("listing triggered webjobs as swagger", cb));
        },

        getTriggered: function getTriggered(name, cb): void {
            var options = {
                uri: "/api/triggeredwebjobs/" + encodeURIComponent(name),
                json: true
            };
            var action = "getting triggered webjob with name '" + name + "'";

            request(options, utils.createCallback(action, cb));
        },

        uploadTriggered: function uploadTriggered(name, localPath, cb): void {
            var options = {
                uri: "/api/triggeredwebjobs/" + encodeURIComponent(name),
                json: true,
                headers: createUploadHeaders(localPath)
            };
            var action = "uploading triggered webjob with name '" + name + "'";

            fs.createReadStream(localPath)
                .on("error", cb)
                .pipe(request.put(options, utils.createCallback(action, cb)));
        },

        deleteTriggered: function deleteTriggered(name, cb): void {
            var url = "/api/triggeredwebjobs/" + encodeURIComponent(name);
            var action = "deleting triggered webjob with name '" + name + "'";

            request.del(url, utils.createCallback(action, cb));
        },

        runTriggered: function runTriggered(name, args, cb): void {
            var query = { arguments: undefined };
            
            if (typeof args === "function") {
                cb = args;
            } else if (args) {
                query.arguments = args;
            }

            var options = {
                url: "/api/triggeredwebjobs/" + encodeURIComponent(name) + "/run",
                qs: query
            };
            var action = "running triggered webjob with name '" + name + "'";

            request.post(options, utils.createCallback(action, cb));
        },

        listTriggeredHistory: function listTriggeredHistory(name, cb): void {
            var options = {
                uri: "/api/triggeredwebjobs/" + encodeURIComponent(name) + "/history",
                json: true
            };
            var action = "listing history for triggered webjob with name '" + name + "'";

            request(options, utils.createCallback(action, cb));
        },

        getTriggeredHistory: function getTriggeredHistory(name, id, cb): void {
            var options = {
                uri: "/api/triggeredwebjobs/" + encodeURIComponent(name) + "/history/" + encodeURIComponent(id),
                json: true
            };
            var action = "getting history for triggered webjob with name '" + name + "' and id '" + id + "'";

            request(options, utils.createCallback(action, cb));
        },

        listContinuous: function listContinuous(cb): void {
            var options = {
                uri: "/api/continuouswebjobs",
                json: true
            };

            request(options, utils.createCallback("listing continuous webjobs", cb));
        },

        getContinuous: function getContinuous(name, cb): void {
            var options = {
                uri: "/api/continuouswebjobs/" + encodeURIComponent(name),
                json: true
            };
            var action = "getting continuous webjob with name '" + name + "'";

            request(options, utils.createCallback(action, cb));
        },

        uploadContinuous: function uploadContinuous(name, localPath, cb): void {
            var options = {
                uri: "/api/continuouswebjobs/" + encodeURIComponent(name),
                json: true,
                headers: createUploadHeaders(localPath)
            };
            var action = "uploading continuous webjob with name '" + name + "'";

            fs.createReadStream(localPath)
                .on("error", cb)
                .pipe(request.put(options, utils.createCallback(action, cb)));
        },

        deleteContinuous: function deleteContinuous(name, cb): void {
            var url = "/api/continuouswebjobs/" + encodeURIComponent(name);
            var action = "deleting continuous webjob with name '" + name + "'";

            request.del(url, utils.createCallback(action, cb));
        },

        startContinuous: function startContinuous(name, cb): void {
            var url = "/api/continuouswebjobs/" + encodeURIComponent(name) + "/start";
            var action = "starting continuous webjob with name '" + name + "'";

            request.post(url, utils.createCallback(action, cb));
        },

        stopContinuous: function stopContinuous(name, cb): void {
            var url = "/api/continuouswebjobs/" + encodeURIComponent(name) + "/stop";
            var action = "stopping continuous webjob with name '" + name + "'";

            request.post(url, utils.createCallback(action, cb));
        },

        getContinuousSettings: function getContinuousSettings(name, cb): void {
            var options = {
                uri: "/api/continuouswebjobs/" + encodeURIComponent(name) + "/settings",
                json: true
            };
            var action = "getting continuous webjob settings with name '" + name + "'";

            request.get(options, utils.createCallback(action, cb));
        },

        setContinuousSettings: function setContinuousSettings(name, settings, cb): void {
            var options = {
                uri: "/api/continuouswebjobs/" + encodeURIComponent(name) + "/settings",
                json: settings
            };
            var action = "setting continuous webjob settings with name '" + name + "'";

            request.put(options, utils.createCallback(action, cb));
        }
    };
}
