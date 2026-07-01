import type { GatewayClientOptions } from "./client.js";
import { type EventLoopReadyOptions, type EventLoopReadyResult } from "./event-loop-ready.js";
export type GatewayClientStartable = {
    start(): void;
};
/** Injectable readiness waiter used by tests and alternate event-loop probes. */
export type EventLoopReadyWaiter = (options?: EventLoopReadyOptions) => Promise<EventLoopReadyResult>;
/** Timeout and abort controls for delaying client start until the loop can process IO. */
export type GatewayClientStartReadinessOptions = {
    timeoutMs?: number;
    clientOptions?: Pick<GatewayClientOptions, "connectChallengeTimeoutMs" | "connectDelayMs" | "env" | "preauthHandshakeTimeoutMs">;
    signal?: AbortSignal;
};
/** Starts a gateway client only after the supplied readiness probe succeeds. */
export declare function startGatewayClientWithReadinessWait(waitForReady: EventLoopReadyWaiter, client: GatewayClientStartable, options?: GatewayClientStartReadinessOptions): Promise<EventLoopReadyResult>;
/** Starts a gateway client after the default event-loop readiness probe succeeds. */
export declare function startGatewayClientWhenEventLoopReady(client: GatewayClientStartable, options?: GatewayClientStartReadinessOptions): Promise<EventLoopReadyResult>;
