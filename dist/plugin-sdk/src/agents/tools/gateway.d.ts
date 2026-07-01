import { type OperatorScope } from "../../gateway/method-scopes.js";
/** Optional gateway connection overrides accepted by agent tools. */
export type GatewayCallOptions = {
    gatewayUrl?: string;
    gatewayToken?: string;
    timeoutMs?: number;
};
type GatewayOverrideTarget = "local" | "remote";
/** Reads common gateway options from tool parameters while preserving explicit token whitespace. */
export declare function readGatewayCallOptions(params: Record<string, unknown>): GatewayCallOptions;
/**
 * Resolves the gateway URL, token, and timeout for agent tool calls.
 */
export declare function resolveGatewayOptions(opts?: GatewayCallOptions): {
    url: string | undefined;
    token: string | undefined;
    timeoutMs: number;
    target: GatewayOverrideTarget;
};
/**
 * Calls a gateway method as the agent-tool backend client with least-privilege scopes.
 */
export declare function callGatewayTool<T = Record<string, unknown>>(method: string, opts: GatewayCallOptions, params?: unknown, extra?: {
    expectFinal?: boolean;
    scopes?: OperatorScope[];
}): Promise<T>;
export {};
