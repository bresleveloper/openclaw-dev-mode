import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AgentMessage } from "../runtime/index.js";
/**
 * Limits conversation history to the last N user turns (and their associated
 * assistant responses). This reduces token usage for long-running DM sessions.
 */
export declare function limitHistoryTurns(messages: AgentMessage[], limit: number | undefined): AgentMessage[];
/**
 * Extract provider + user ID from a session key and look up dmHistoryLimit.
 * Supports per-DM overrides and provider defaults.
 * For channel/group sessions, uses historyLimit from provider config.
 */
export declare function getHistoryLimitFromSessionKey(sessionKey: string | undefined, config: OpenClawConfig | undefined): number | undefined;
