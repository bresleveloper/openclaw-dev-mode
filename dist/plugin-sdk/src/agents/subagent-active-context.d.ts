/**
 * Active subagent prompt context builder.
 *
 * Renders sanitized runtime-owned subagent state into system prompt additions.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Builds the runtime-owned active subagent section appended to the system prompt. */
export declare function buildActiveSubagentSystemPromptAddition(params: {
    cfg: OpenClawConfig;
    controllerSessionKey?: string;
    hasSessionsYield?: boolean;
    recentMinutes?: number;
}): string | undefined;
