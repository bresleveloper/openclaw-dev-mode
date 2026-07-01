import type { RuntimeEnv } from "../runtime.js";
/** Result returned by one transport readiness probe attempt. */
export type TransportReadyResult = {
    ok: boolean;
    error?: string | null;
};
/** Parameters for polling a channel transport until it can accept runtime work. */
export type WaitForTransportReadyParams = {
    label: string;
    timeoutMs: number;
    logAfterMs?: number;
    logIntervalMs?: number;
    pollIntervalMs?: number;
    abortSignal?: AbortSignal;
    runtime: RuntimeEnv;
    check: () => Promise<TransportReadyResult>;
};
/**
 * Polls a channel transport readiness probe until it succeeds, times out, or aborts.
 *
 * Used by channel plugins that start external daemons or subscribe to local transports before
 * processing inbound events, with bounded retry logging through the caller's runtime sink.
 */
export declare function waitForTransportReady(params: WaitForTransportReadyParams): Promise<void>;
