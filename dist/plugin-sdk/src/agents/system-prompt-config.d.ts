/**
 * Config-aware system prompt builder.
 *
 * This module gathers agent/config knobs before rendering the canonical system
 * prompt so callers do not duplicate owner, TTS, alias, memory, or FS policy.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { buildAgentSystemPrompt } from "./system-prompt.js";
type AgentSystemPromptRenderParams = Parameters<typeof buildAgentSystemPrompt>[0];
/** Config-derived system prompt fields passed into the prompt renderer. */
type ResolvedAgentSystemPromptConfig = Pick<AgentSystemPromptRenderParams, "ownerDisplay" | "ownerDisplaySecret" | "subagentDelegationMode" | "ttsHint" | "modelAliasLines" | "memoryCitationsMode" | "fsWorkspaceOnly">;
type ConfiguredAgentSystemPromptParams = AgentSystemPromptRenderParams & {
    config?: OpenClawConfig;
    agentId?: string;
};
/** Resolves all config-derived system prompt fields for an agent. */
export declare function resolveAgentSystemPromptConfig(params: {
    config?: OpenClawConfig;
    agentId?: string;
}): ResolvedAgentSystemPromptConfig;
/** Builds the agent system prompt after applying config-derived prompt fields. */
export declare function buildConfiguredAgentSystemPrompt(params: ConfiguredAgentSystemPromptParams): string;
export {};
