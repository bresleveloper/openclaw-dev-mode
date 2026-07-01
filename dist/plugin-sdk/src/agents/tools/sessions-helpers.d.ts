/**
 * Shared session-tool data shapes and classification helpers.
 *
 * Keeps list/send/status tools aligned on rows, visibility context, and compact kind/channel labels.
 */
export { createAgentToAgentPolicy, createSessionVisibilityGuard, createSessionVisibilityRowChecker, resolveEffectiveSessionToolsVisibility, resolveSandboxedSessionToolContext, } from "./sessions-access.js";
export { resolveCurrentSessionClientAlias, resolveDisplaySessionKey, resolveInternalSessionKey, resolveMainSessionAlias, resolveSessionReference, resolveVisibleSessionReference, shouldResolveSessionIdInput, } from "./sessions-resolution.js";
import { type FastMode } from "@openclaw/normalization-core/string-coerce";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { FastModeSource } from "../../shared/fast-mode.js";
/** Coarse session category used by session list/status tools. */
type SessionKind = "main" | "group" | "cron" | "hook" | "node" | "other";
/** Delivery target metadata attached to session rows. */
type SessionListDeliveryContext = {
    channel?: string;
    to?: string;
    accountId?: string;
    threadId?: string | number;
};
/** Compact run status shown by session tools. */
export type SessionRunStatus = "running" | "done" | "failed" | "killed" | "timeout";
/** Normalized session row returned by session list-style tools. */
export type SessionListRow = {
    key: string;
    agentId?: string;
    kind: SessionKind;
    channel: string;
    origin?: {
        provider?: string;
        accountId?: string;
    };
    spawnedBy?: string;
    label?: string;
    displayName?: string;
    derivedTitle?: string;
    lastMessagePreview?: string;
    parentSessionKey?: string;
    deliveryContext?: SessionListDeliveryContext;
    updatedAt?: number | null;
    sessionId?: string;
    model?: string;
    contextTokens?: number | null;
    totalTokens?: number | null;
    estimatedCostUsd?: number;
    status?: SessionRunStatus;
    startedAt?: number;
    endedAt?: number;
    runtimeMs?: number;
    childSessions?: string[];
    thinkingLevel?: string;
    fastMode?: FastMode;
    effectiveFastMode?: FastMode;
    effectiveFastModeSource?: FastModeSource;
    fastAutoOnSeconds?: number;
    verboseLevel?: string;
    reasoningLevel?: string;
    elevatedLevel?: string;
    responseUsage?: string;
    systemSent?: boolean;
    abortedLastRun?: boolean;
    sendPolicy?: string;
    lastChannel?: string;
    lastTo?: string;
    lastAccountId?: string;
    lastThreadId?: string | number;
    transcriptPath?: string;
    messages?: unknown[];
};
/** Resolves config plus sandbox visibility context for a session tool call. */
export declare function resolveSessionToolContext(opts?: {
    agentSessionKey?: string;
    sandboxed?: boolean;
    config?: OpenClawConfig;
}): {
    mainKey: string;
    alias: string;
    visibility: "spawned" | "all";
    requesterInternalKey: string | undefined;
    effectiveRequesterKey: string;
    restrictToSpawned: boolean;
    cfg: OpenClawConfig;
};
/** Classifies a session key/gateway kind into the row category used by tools. */
export declare function classifySessionKind(params: {
    key: string;
    gatewayKind?: string | null;
    alias: string;
    mainKey: string;
}): SessionKind;
/** Derives the best channel label for a session row. */
export declare function deriveChannel(params: {
    key: string;
    kind: SessionKind;
    channel?: string | null;
    lastChannel?: string | null;
}): string;
