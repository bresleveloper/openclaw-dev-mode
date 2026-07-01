import { ensureSelectedAgentHarnessPlugin } from "../../agents/harness/runtime-plugin.js";
import { runWithModelFallback } from "../../agents/model-fallback.js";
import { type SessionEntry } from "../../config/sessions.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { emitAgentEvent, registerAgentRunContext } from "../../infra/agent-events.js";
import type { TemplateContext } from "../templating.js";
import type { VerboseLevel } from "../thinking.js";
import type { GetReplyOptions, ReplyPayload } from "../types.js";
import type { CompactionNoticePhase } from "./compaction-notice.js";
import { refreshQueuedFollowupSession, type FollowupRun } from "./queue.js";
import type { ReplyOperation } from "./reply-run-registry.js";
import { incrementCompactionCount } from "./session-updates.js";
type UpdateSessionEntryParams = {
    storePath: string;
    sessionKey: string;
    skipMaintenance?: boolean;
    takeCacheOwnership?: boolean;
    update: (entry: SessionEntry) => Promise<Partial<SessionEntry> | null> | Partial<SessionEntry> | null;
};
declare function compactEmbeddedAgentSessionDefault(...args: Parameters<typeof import("../../agents/embedded-agent.js").compactEmbeddedAgentSession>): Promise<Awaited<ReturnType<typeof import("../../agents/embedded-agent.js").compactEmbeddedAgentSession>>>;
declare function runEmbeddedAgentDefault(...args: Parameters<typeof import("../../agents/embedded-agent.js").runEmbeddedAgent>): Promise<Awaited<ReturnType<typeof import("../../agents/embedded-agent.js").runEmbeddedAgent>>>;
declare function updateSessionEntryDefault(params: UpdateSessionEntryParams): Promise<SessionEntry | null>;
declare function ensureMemoryFlushTargetFile(params: {
    workspaceDir: string;
    relativePath: string;
}): Promise<void>;
declare const memoryDeps: {
    compactEmbeddedAgentSession: typeof compactEmbeddedAgentSessionDefault;
    runWithModelFallback: typeof runWithModelFallback;
    ensureSelectedAgentHarnessPlugin: typeof ensureSelectedAgentHarnessPlugin;
    runEmbeddedAgent: typeof runEmbeddedAgentDefault;
    ensureMemoryFlushTargetFile: typeof ensureMemoryFlushTargetFile;
    registerAgentRunContext: typeof registerAgentRunContext;
    refreshQueuedFollowupSession: typeof refreshQueuedFollowupSession;
    incrementCompactionCount: typeof incrementCompactionCount;
    updateSessionEntry: typeof updateSessionEntryDefault;
    emitAgentEvent: typeof emitAgentEvent;
    randomUUID: () => `${string}-${string}-${string}-${string}-${string}`;
    now: () => number;
};
/** Overrides memory helper dependencies for tests. */
export declare function setAgentRunnerMemoryTestDeps(overrides?: Partial<typeof memoryDeps>): void;
/** Usage snapshot read from a session transcript before compaction. */
export type SessionTranscriptUsageSnapshot = {
    promptTokens?: number;
    outputTokens?: number;
    trailingBytesTokens?: number;
};
/** Runs preflight compaction when session state exceeds configured thresholds. */
export declare function runPreflightCompactionIfNeeded(params: {
    cfg: OpenClawConfig;
    followupRun: FollowupRun;
    promptForEstimate?: string;
    defaultModel: string;
    agentCfgContextTokens?: number;
    sessionEntry?: SessionEntry;
    sessionStore?: Record<string, SessionEntry>;
    sessionKey?: string;
    runtimePolicySessionKey?: string;
    storePath?: string;
    isHeartbeat: boolean;
    replyOperation: ReplyOperation;
    onCompactionNotice?: (phase: CompactionNoticePhase) => Promise<void> | void;
}): Promise<SessionEntry | undefined>;
/** Runs post-turn memory flush when transcript state warrants it. */
export declare function runMemoryFlushIfNeeded(params: {
    cfg: OpenClawConfig;
    followupRun: FollowupRun;
    promptForEstimate?: string;
    sessionCtx: TemplateContext;
    opts?: GetReplyOptions;
    defaultModel: string;
    agentCfgContextTokens?: number;
    resolvedVerboseLevel: VerboseLevel;
    sessionEntry?: SessionEntry;
    sessionStore?: Record<string, SessionEntry>;
    sessionKey?: string;
    runtimePolicySessionKey?: string;
    storePath?: string;
    isHeartbeat: boolean;
    replyOperation: ReplyOperation;
    onVisibleErrorPayloads?: (payloads: ReplyPayload[]) => void;
}): Promise<SessionEntry | undefined>;
export {};
