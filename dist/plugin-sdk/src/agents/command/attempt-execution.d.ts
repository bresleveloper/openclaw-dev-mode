/**
 * Orchestrates one agent attempt across embedded, CLI, and ACP runtimes.
 */
import type { AcpRuntimeEvent } from "@openclaw/acp-core/runtime/types";
import type { FastMode } from "@openclaw/normalization-core/string-coerce";
import type { ThinkLevel, VerboseLevel } from "../../auto-reply/thinking.js";
import type { SessionEntry } from "../../config/sessions/types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { PluginMetadataSnapshot } from "../../plugins/plugin-metadata-snapshot.types.js";
import { type PersistedUserTurnMessage } from "../../sessions/user-turn-transcript.js";
import { buildWorkspaceSkillSnapshot } from "../../skills/loading/workspace.js";
import { resolveMessageChannel } from "../../utils/message-channel.js";
import { type EmbeddedAgentRunResult } from "../embedded-agent.js";
import type { AgentMessage } from "../runtime/index.js";
import { resolveAgentRunContext } from "./run-context.js";
import type { AgentCommandOpts } from "./types.js";
export { createAcpVisibleTextAccumulator, sessionFileHasContent, } from "./attempt-execution.helpers.js";
type PersistTextTurnTranscriptResult = {
    kind: "persisted";
    sessionEntry: SessionEntry | undefined;
} | {
    kind: "session-rebound";
    sessionEntry: undefined;
};
export declare function persistAcpTurnTranscript(params: {
    body: string;
    transcriptBody?: string;
    finalText: string;
    sessionId: string;
    sessionKey: string;
    sessionEntry: SessionEntry | undefined;
    sessionStore?: Record<string, SessionEntry>;
    storePath?: string;
    sessionAgentId: string;
    threadId?: string | number;
    sessionCwd: string;
    config: OpenClawConfig;
}): Promise<PersistTextTurnTranscriptResult>;
export declare function persistCliTurnTranscript(params: {
    body: string;
    transcriptBody?: string;
    userMessage?: PersistedUserTurnMessage;
    result: EmbeddedAgentRunResult;
    sessionId: string;
    sessionKey: string;
    sessionEntry: SessionEntry | undefined;
    sessionStore?: Record<string, SessionEntry>;
    storePath?: string;
    sessionAgentId: string;
    threadId?: string | number;
    sessionCwd: string;
    config: OpenClawConfig;
    embeddedAssistantGapFill?: boolean;
}): Promise<PersistTextTurnTranscriptResult>;
export declare function runAgentAttempt(params: {
    providerOverride: string;
    modelOverride: string;
    originalProvider: string;
    cfg: OpenClawConfig;
    sessionEntry: SessionEntry | undefined;
    sessionId: string;
    sessionKey: string | undefined;
    sessionAgentId: string;
    sessionFile: string;
    workspaceDir: string;
    cwd?: string;
    body: string;
    isFallbackRetry: boolean;
    resolvedThinkLevel: ThinkLevel;
    fastMode?: FastMode;
    fastModeStartedAtMs?: number;
    fastModeAutoOnSeconds?: number;
    isFinalFallbackAttempt?: boolean;
    timeoutMs: number;
    runTimeoutOverrideMs?: number;
    runId: string;
    lifecycleGeneration: string;
    opts: AgentCommandOpts;
    runContext: ReturnType<typeof resolveAgentRunContext>;
    spawnedBy: string | undefined;
    messageChannel: ReturnType<typeof resolveMessageChannel>;
    skillsSnapshot: ReturnType<typeof buildWorkspaceSkillSnapshot> | undefined;
    resolvedVerboseLevel: VerboseLevel | undefined;
    agentDir: string;
    onAgentEvent: (evt: {
        stream: string;
        data?: Record<string, unknown>;
        sessionKey?: string;
    }) => void;
    deferTerminalLifecycle?: boolean;
    /** @deprecated Use deferTerminalLifecycle. */
    deferTerminalLifecycleEnd?: boolean;
    authProfileProvider: string;
    sessionStore?: Record<string, SessionEntry>;
    storePath?: string;
    pluginsEnabled?: boolean;
    metadataSnapshot?: PluginMetadataSnapshot;
    allowTransientCooldownProbe?: boolean;
    modelFallbacksOverride?: string[];
    sessionHasHistory?: boolean;
    suppressPromptPersistenceOnRetry?: boolean;
    onUserMessagePersisted?: (message: Extract<AgentMessage, {
        role: "user";
    }>) => void;
    onLifecycleGenerationChanged?: (lifecycleGeneration: string) => void;
}): Promise<EmbeddedAgentRunResult>;
export declare function buildAcpResult(params: {
    payloadText: string;
    startedAt: number;
    stopReason?: string;
    abortSignal?: AbortSignal;
}): {
    payloads: import("../../auto-reply/reply-payload.ts").ReplyPayload[];
    meta: {
        durationMs: number;
        aborted: boolean;
        stopReason: string | undefined;
    };
};
export declare function emitAcpLifecycleStart(params: {
    runId: string;
    startedAt: number;
    lifecycleGeneration?: string;
}): void;
export declare function emitAcpPromptSubmitted(params: {
    runId: string;
    sessionKey?: string;
    at: number;
}): void;
export declare function emitAcpRuntimeEvent(params: {
    runId: string;
    event: AcpRuntimeEvent;
    sessionKey?: string;
}): void;
export declare function emitAcpLifecycleEnd(params: {
    runId: string;
    lifecycleGeneration?: string;
    abortSignal?: AbortSignal;
}): void;
export declare function emitAcpLifecycleError(params: {
    runId: string;
    error: unknown;
    sessionKey?: string;
    lifecycleGeneration?: string;
    abortSignal?: AbortSignal;
}): void;
export declare function emitAcpAssistantDelta(params: {
    runId: string;
    text: string;
    delta: string;
}): void;
