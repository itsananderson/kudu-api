import { Response } from "request";

export interface ApiResponse<P> {
  payload: P;
  rawResponse: Response;
}
