"use strict";

function resolveHttpError(response, message) {
    if (response.statusCode < 400) {
        return;
    }

    message = message
        ? message + " "
        : "";

    message += "Status code " + response.statusCode + " (" + response.statusMessage + "). See the response property for details.";

    var error = new Error(message);
    error.response = response;

    return error;
}

function createCallback(action, cb) {
    return function (err, response) {
        err = err || resolveHttpError(response, "Error " + action + ".");

        if (err) {
            return cb(err);
        }

        cb(null, response);
    };
}

function createBodyCallback(action, cb) {
    return createCallback(action, function (err, response) {
        if (err) {
            return cb(err);
        }

        cb(null, response.body, response);
    });
}

function createJsonCallback(action, cb) {
    return createCallback(action, function (err, response) {
        if (err) {
            return cb(err);
        }

        try {
            var data = JSON.parse(response.body);
        } catch (e) {
            return cb(e);
        }

        cb(null, data, response);
    });
}

module.exports = {
    createCallback: createCallback,
    createBodyCallback: createBodyCallback,
    createJsonCallback: createJsonCallback
};
