import type { GatewayClientStartable, GatewayClientStartReadinessOptions } from "../../packages/gateway-client/src/readiness.js";
import { type EventLoopReadyResult } from "./event-loop-ready.js";
export type { GatewayClientStartable, GatewayClientStartReadinessOptions, } from "../../packages/gateway-client/src/readiness.js";
/** Starts a gateway client once the shared event-loop readiness check passes. */
export declare function startGatewayClientWhenEventLoopReady(client: GatewayClientStartable, options?: GatewayClientStartReadinessOptions): Promise<EventLoopReadyResult>;
