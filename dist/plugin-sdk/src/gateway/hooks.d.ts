import type { IncomingMessage } from "node:http";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { HookExternalContentSource } from "../security/external-content.js";
import { type HookMappingResolved } from "./hooks-mapping.js";
import type { HookMessageChannel } from "./hooks.types.js";
/** Fully resolved hooks config used by gateway hook request handling. */
export type HooksConfigResolved = {
    basePath: string;
    token: string;
    maxBodyBytes: number;
    mappings: HookMappingResolved[];
    agentPolicy: HookAgentPolicyResolved;
    sessionPolicy: HookSessionPolicyResolved;
};
type HookAgentPolicyResolved = {
    defaultAgentId: string;
    knownAgentIds: Set<string>;
    allowedAgentIds?: Set<string>;
};
type HookSessionPolicyResolved = {
    defaultSessionKey?: string;
    allowRequestSessionKey: boolean;
    allowedSessionKeyPrefixes?: string[];
};
type HookSessionKeySource = "request" | "mapping-static" | "mapping-templated";
/** Resolve and validate hook config, returning null when hooks are disabled. */
export declare function resolveHooksConfig(cfg: OpenClawConfig): HooksConfigResolved | null;
/** Check whether a hook session key satisfies the configured prefix allowlist. */
export declare function isSessionKeyAllowedByPrefix(sessionKey: string, prefixes: string[]): boolean;
/** Extract the hook bearer token from Authorization or x-openclaw-token headers. */
export declare function extractHookToken(req: IncomingMessage): string | undefined;
/** Read and normalize a hook JSON request body with gateway-friendly error text. */
export declare function readJsonBody(req: IncomingMessage, maxBytes: number): Promise<{
    ok: true;
    value: unknown;
} | {
    ok: false;
    error: string;
}>;
/** Normalize request headers into lowercase string values for hook template matching. */
export declare function normalizeHookHeaders(req: IncomingMessage): Record<string, string>;
/** Validate a hook wake payload. */
export declare function normalizeWakePayload(payload: Record<string, unknown>): {
    ok: true;
    value: {
        text: string;
        mode: "now" | "next-heartbeat";
    };
} | {
    ok: false;
    error: string;
};
type HookAgentPayload = {
    message: string;
    name: string;
    agentId?: string;
    idempotencyKey?: string;
    wakeMode: "now" | "next-heartbeat";
    sessionKey?: string;
    deliver: boolean;
    channel: HookMessageChannel;
    to?: string;
    model?: string;
    thinking?: string;
    timeoutSeconds?: number;
};
/** Normalized agent dispatch payload after hook policy/session resolution. */
export type HookAgentDispatchPayload = Omit<HookAgentPayload, "sessionKey"> & {
    sessionKey: string;
    sourcePath: string;
    allowUnsafeExternalContent?: boolean;
    externalContentSource?: HookExternalContentSource;
};
/** Channel values accepted by hook agent dispatch. */
export type { HookMessageChannel } from "./hooks.types.js";
/** Render the current hook channel validation error from registered channel plugins. */
export declare const getHookChannelError: () => string;
/** Resolve a raw hook channel value, defaulting omitted values to `last`. */
export declare function resolveHookChannel(raw: unknown): HookMessageChannel | null;
/** Resolve hook delivery opt-out; any value except false means deliver. */
export declare function resolveHookDeliver(raw: unknown): boolean;
/** Resolve the hook idempotency key from headers or payload within length limits. */
export declare function resolveHookIdempotencyKey(params: {
    payload: Record<string, unknown>;
    headers?: Record<string, string>;
}): string | undefined;
/** Resolve an optional hook target agent id to a known configured agent. */
export declare function resolveHookTargetAgentId(hooksConfig: HooksConfigResolved, agentId: string | undefined): string | undefined;
/** Resolve the effective hook target agent, falling back to the hook default. */
export declare function resolveEffectiveHookTargetAgentId(hooksConfig: HooksConfigResolved, agentId: string | undefined): string;
/** Check the hook agent allowlist against the effective target agent. */
export declare function isHookAgentAllowed(hooksConfig: HooksConfigResolved, agentId: string | undefined): boolean;
/** Error message for hook agent allowlist failures. */
export declare const getHookAgentPolicyError: () => string;
/** Error message for hook session-key prefix allowlist failures. */
export declare const getHookSessionKeyPrefixError: (prefixes: string[]) => string;
/** Resolve the hook dispatch session key from request, mapping, default, or generated id. */
export declare function resolveHookSessionKey(params: {
    hooksConfig: HooksConfigResolved;
    source: HookSessionKeySource;
    sessionKey?: string;
    idFactory?: () => string;
}): {
    ok: true;
    value: string;
} | {
    ok: false;
    error: string;
};
/** Re-scope agent-prefixed hook session keys to the selected target agent. */
export declare function normalizeHookDispatchSessionKey(params: {
    sessionKey: string;
    targetAgentId: string | undefined;
}): string;
/** Validate and normalize a hook agent payload before policy/session resolution. */
export declare function normalizeAgentPayload(payload: Record<string, unknown>): {
    ok: true;
    value: HookAgentPayload;
} | {
    ok: false;
    error: string;
};
