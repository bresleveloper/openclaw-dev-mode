import type { SessionScope } from "../config/types.base.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Routing policy derived from config and the source session for an event. */
export type EventSessionRoutingPolicy = {
    mainKey?: string;
    sessionScope?: SessionScope;
    dmScope?: string | null;
    allowFrom?: ReadonlyArray<string | number> | null;
    channel?: string | null;
    accountId?: string | null;
    preserveSessionKey?: boolean;
};
type DirectSessionTarget = {
    agentId: string;
    channel?: string;
    accountId?: string;
    peerId: string;
};
/** Parse an agent direct-session key into channel/account/peer routing parts. */
export declare function parseDirectAgentSessionTarget(sessionKey: string | undefined | null): DirectSessionTarget | null;
/** Resolve the configured DM allowlist that applies to an event session. */
export declare function resolveEventSessionAllowFrom(params: {
    cfg?: OpenClawConfig;
    sessionKey?: string | null;
    channel?: string | null;
    accountId?: string | null;
}): Array<string | number> | undefined;
/** Build the routing policy used by event wakeups and scoped heartbeat options. */
export declare function resolveEventSessionRoutingPolicy(params: {
    cfg?: OpenClawConfig;
    sessionKey?: string | null;
    channel?: string | null;
    accountId?: string | null;
    dmScope?: string | null;
    allowFrom?: ReadonlyArray<string | number> | null;
}): EventSessionRoutingPolicy;
/** Resolve a direct DM event session to the configured main session when allowed. */
export declare function resolveMainScopedEventSessionKey(params: {
    cfg?: OpenClawConfig;
    sessionKey: string;
    agentId?: string | null;
    policy?: EventSessionRoutingPolicy;
}): string | null;
/** Apply event routing policy to a raw session key. */
export declare function resolveEventSessionKeyForPolicy(sessionKey: string, policy?: EventSessionRoutingPolicy): string;
/** Apply event routing policy while preserving wake option typing. */
export declare function scopedHeartbeatWakeOptionsForPolicy<T extends object>(sessionKey: string, wakeOptions: T, policy?: EventSessionRoutingPolicy): T | (T & {
    sessionKey: string;
}) | (T & {
    agentId: string;
});
export {};
