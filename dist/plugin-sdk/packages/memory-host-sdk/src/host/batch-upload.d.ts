import { type BatchHttpClientConfig } from "./batch-utils.js";
/** Upload embedding batch requests and return the provider file id. */
export declare function uploadBatchJsonlFile(params: {
    client: BatchHttpClientConfig;
    requests: unknown[];
    errorPrefix: string;
    maxResponseBytes?: number;
    signal?: AbortSignal;
}): Promise<string>;
