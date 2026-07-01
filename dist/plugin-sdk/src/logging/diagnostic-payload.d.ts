type LargePayloadBase = {
    surface: string;
    bytes?: number;
    limitBytes?: number;
    count?: number;
    channel?: string;
    pluginId?: string;
    reason?: string;
};
/** Emits a normalized diagnostic event for rejected, truncated, or chunked payloads. */
export declare function logLargePayload(params: LargePayloadBase & {
    action: "rejected" | "truncated" | "chunked";
}): void;
/** Convenience wrapper for payloads rejected before downstream processing. */
export declare function logRejectedLargePayload(params: LargePayloadBase): void;
/** Parses an HTTP Content-Length header without accepting malformed numeric input. */
export declare function parseContentLengthHeader(raw: string | string[] | undefined): number | undefined;
export {};
