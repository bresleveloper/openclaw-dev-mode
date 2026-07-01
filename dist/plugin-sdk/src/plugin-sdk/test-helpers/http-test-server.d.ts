import { type RequestListener } from "node:http";
/** Run an ephemeral loopback HTTP server for the duration of an async test callback. */
export declare function withServer(handler: RequestListener, fn: (baseUrl: string) => Promise<void>): Promise<void>;
