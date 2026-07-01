/**
 * Adjusts exec/process tool descriptions for long-running follow-up behavior.
 * Cron-aware runs can point models at scheduled follow-ups; cronless runs keep
 * guidance constrained to process polling and wake handling.
 */
import type { AnyAgentTool } from "./agent-tools.types.js";
/** Return tools with exec/process descriptions adjusted for cron availability. */
export declare function applyDeferredFollowupToolDescriptions(tools: AnyAgentTool[], params?: {
    agentId?: string;
}): AnyAgentTool[];
