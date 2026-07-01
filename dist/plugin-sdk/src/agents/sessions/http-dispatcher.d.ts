export declare const DEFAULT_HTTP_IDLE_TIMEOUT_MS = 300000;
/** Parses idle timeout values, using `0` for the explicit disabled sentinel. */
export declare function parseHttpIdleTimeoutMs(value: unknown): number | undefined;
