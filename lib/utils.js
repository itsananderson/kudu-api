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

module.exports = {
    resolveHttpError: resolveHttpError
};
