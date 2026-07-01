import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type ThreadBindingLifecycleRecord } from "../shared/thread-binding-lifecycle.js";
export { resolveThreadBindingLifecycle, } from "../shared/thread-binding-lifecycle.js";
/** Thread-bound session type controlled by spawn policy. */
export type ThreadBindingSpawnKind = "subagent" | "acp";
/** Effective per-channel/account policy for creating thread-bound sessions. */
export type ThreadBindingSpawnPolicy = {
    channel: string;
    accountId: string;
    enabled: boolean;
    spawnEnabled: boolean;
    defaultSpawnContext: ThreadBindingSpawnContext;
};
/** Starting transcript mode for a spawned thread-bound session. */
type ThreadBindingSpawnContext = "isolated" | "fork";
/** Returns true when top-level commands should spawn in a child thread by default. */
export declare function supportsAutomaticThreadBindingSpawn(channel: string): boolean;
/** Returns true when /thread here needs a native channel thread to exist first. */
export declare function requiresNativeThreadContextForThreadHere(channel: string): boolean;
/** Resolves whether a thread binding should attach to the current thread or create a child. */
export declare function resolveThreadBindingPlacementForCurrentContext(params: {
    channel: string;
    threadId?: string;
}): "current" | "child";
/** Resolves thread-binding idle timeout with channel/account override before session default. */
export declare function resolveThreadBindingIdleTimeoutMs(params: {
    channelIdleHoursRaw: unknown;
    sessionIdleHoursRaw: unknown;
}): number;
/** Resolves thread-binding max age with channel/account override before session default. */
export declare function resolveThreadBindingMaxAgeMs(params: {
    channelMaxAgeHoursRaw: unknown;
    sessionMaxAgeHoursRaw: unknown;
}): number;
/** Computes the effective expiry timestamp for a thread-binding lifecycle record. */
export declare function resolveThreadBindingEffectiveExpiresAt(params: {
    record: ThreadBindingLifecycleRecord;
    defaultIdleTimeoutMs: number;
    defaultMaxAgeMs: number;
}): number | undefined;
/** Resolves the effective enabled flag for thread bindings. */
export declare function resolveThreadBindingsEnabled(params: {
    channelEnabledRaw: unknown;
    sessionEnabledRaw: unknown;
}): boolean;
/** Resolves effective spawn policy from account, channel, then global thread-binding config. */
export declare function resolveThreadBindingSpawnPolicy(params: {
    cfg: OpenClawConfig;
    channel: string;
    accountId?: string;
    kind: ThreadBindingSpawnKind;
}): ThreadBindingSpawnPolicy;
/** Resolves idle timeout for a concrete channel/account config scope. */
export declare function resolveThreadBindingIdleTimeoutMsForChannel(params: {
    cfg: OpenClawConfig;
    channel: string;
    accountId?: string;
}): number;
/** Resolves max age for a concrete channel/account config scope. */
export declare function resolveThreadBindingMaxAgeMsForChannel(params: {
    cfg: OpenClawConfig;
    channel: string;
    accountId?: string;
}): number;
/** Formats the user-facing error for disabled thread bindings. */
export declare function formatThreadBindingDisabledError(params: {
    channel: string;
    accountId: string;
    kind: ThreadBindingSpawnKind;
}): string;
/** Formats the user-facing error for disabled thread-bound session spawning. */
export declare function formatThreadBindingSpawnDisabledError(params: {
    channel: string;
    accountId: string;
    kind: ThreadBindingSpawnKind;
}): string;
