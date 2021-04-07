import { Response } from "request";
import { ApiResponse } from "./types";

export function resolveHttpError(
  response: Response,
  message: string
): Error | undefined {
  if (response.statusCode < 400) {
    return;
  }

  message +=
    "Status code " +
    response.statusCode +
    " (" +
    response.statusMessage +
    "). See the rawResponse property for details.";

  const error: Error & { rawResponse?: Response } = new Error(message);
  error.rawResponse = response;

  return error;
}

export function createPromiseCallback<P>(
  action: string,
  resolve: (response: ApiResponse<P>) => void,
  reject: (err: {}) => void,
  transformPayload: (response: Response, payload: any) => P = (_, p) => p
): (err: Error, response: Response) => void {
  return function (err, response): void {
    err = err || resolveHttpError(response, "Error " + action + ".");

    if (err) {
      return reject(err);
    }

    resolve({
      payload: transformPayload(response, response.body),
      rawResponse: response,
    });
  };
}
