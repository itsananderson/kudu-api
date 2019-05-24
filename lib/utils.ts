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

        cb(null, {
            data: response.body,
            response: response
        });
    };
}

module.exports = {
    createCallback: createCallback
};
