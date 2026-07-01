/**
 * Agent identity and message-prefix resolution.
 * Applies account, channel, global, and per-agent precedence for reactions,
 * prefixes, and human-delay settings.
 */
import type { HumanDelayConfig, IdentityConfig } from "../config/types.base.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Resolve the configured identity block for one agent. */
export declare function resolveAgentIdentity(cfg: OpenClawConfig, agentId: string): IdentityConfig | undefined;
/** Resolve the acknowledgement reaction using account, channel, global, then identity fallback. */
export declare function resolveAckReaction(cfg: OpenClawConfig, agentId: string, opts?: {
    channel?: string;
    accountId?: string;
}): string;
/** Build the automatic `[name]` prefix for an agent identity. */
export declare function resolveIdentityNamePrefix(cfg: OpenClawConfig, agentId: string): string | undefined;
/** Resolve the outbound message prefix, preserving explicit empty prefixes. */
export declare function resolveMessagePrefix(cfg: OpenClawConfig, agentId: string, opts?: {
    configured?: string;
    hasAllowFrom?: boolean;
    fallback?: string;
}): string;
/** Resolve the optional response prefix, expanding `auto` to the identity name prefix. */
export declare function resolveResponsePrefix(cfg: OpenClawConfig, agentId: string, opts?: {
    channel?: string;
    accountId?: string;
}): string | undefined;
/** Resolve message and response prefix values together for channel delivery. */
export declare function resolveEffectiveMessagesConfig(cfg: OpenClawConfig, agentId: string, opts?: {
    hasAllowFrom?: boolean;
    fallbackMessagePrefix?: string;
    channel?: string;
    accountId?: string;
}): {
    messagePrefix: string;
    responsePrefix?: string;
};
/** Resolve per-agent human-delay settings over global agent defaults. */
export declare function resolveHumanDelayConfig(cfg: OpenClawConfig, agentId: string): HumanDelayConfig | undefined;
