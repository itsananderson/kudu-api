"use strict";

function resolveHttpError(response, message) {
    if (response.statusCode < 400) {
        return;
    }

    message = message
        ? message + " "
        : "";

    message += "Status code " + response.statusCode + " (" + response.statusMessage + ").";

    if (response.body) {
        message += " " + response.body;
    }

    var error = new Error(message);
    error.response = response;

    return error;
}

function createCallback(cb, action) {
    return function (err, response) {
        err = err || resolveHttpError(response, "Error " + action + ".");

        if (err) {
            return cb(err);
        }

        cb(null, response);
    };
}

function createJsonCallback(cb, action) {
    return function (err, response) {
        err = err || resolveHttpError(response, "Error " + action + ".");

        if (err) {
            return cb(err);
        }

        try {
            var data = JSON.parse(response.body);
        } catch (e) {
            return cb(e);
        }

        cb(null, data, response);
    };
}

module.exports = {
    resolveHttpError: resolveHttpError,
    createCallback: createCallback,
    createJsonCallback: createJsonCallback
};
