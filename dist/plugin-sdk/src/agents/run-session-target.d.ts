import { type SessionTranscriptRuntimeTarget } from "../config/sessions/session-accessor.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Identifies a run transcript target without naming the current storage artifact. */
export type AgentRunSessionTarget = {
    agentId?: string;
    sessionId?: string;
    sessionKey?: string;
    storePath?: string;
    threadId?: string | number;
};
/** File-backed target resolved from the storage-neutral run identity. */
export type ResolvedAgentRunSessionTarget = SessionTranscriptRuntimeTarget;
/** Resolves the active file-backed target used by current run/session internals. */
export declare function resolveAgentRunSessionTarget(params: {
    agentId?: string;
    config?: OpenClawConfig;
    sessionFile?: string;
    sessionId: string;
    sessionKey?: string;
    sessionTarget?: AgentRunSessionTarget;
}): Promise<ResolvedAgentRunSessionTarget>;
/** Applies identity fields from the explicit target before legacy backfills run. */
export declare function applyAgentRunSessionTargetIdentity<T extends {
    agentId?: string;
    sessionId: string;
    sessionKey?: string;
    sessionTarget?: AgentRunSessionTarget;
}>(params: T): T;
