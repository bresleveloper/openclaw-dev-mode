/**
 * Agent run workspace resolver.
 *
 * Selects per-run workspace directories and redacts run identifiers for logs/prompts.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
type WorkspaceFallbackReason = "missing" | "blank" | "invalid_type";
type AgentIdSource = "explicit" | "session_key" | "default";
type ResolveRunWorkspaceResult = {
    workspaceDir: string;
    usedFallback: boolean;
    fallbackReason?: WorkspaceFallbackReason;
    agentId: string;
    agentIdSource: AgentIdSource;
};
/** Redacts a run/session identifier for logs and prompts. */
export declare function redactRunIdentifier(value: string | undefined): string;
/** Resolves the workspace directory used for an agent run. */
export declare function resolveRunWorkspaceDir(params: {
    workspaceDir: unknown;
    sessionKey?: string;
    agentId?: string;
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): ResolveRunWorkspaceResult;
export {};
