export function resolveHttpError(response, message): Error | undefined {
    if (response.statusCode < 400) {
        return;
    }

    message = message
        ? message + " "
        : "";

    message += "Status code " + response.statusCode + " (" + response.statusMessage + "). See the response property for details.";

    var error: Error & { response?: string } = new Error(message);
    error.response = response;

    return error;
}

export function createCallback(action, cb): (err, response) => void {
    return function (err, response): void {
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
