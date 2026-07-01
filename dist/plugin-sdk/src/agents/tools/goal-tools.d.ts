import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type AnyAgentTool } from "./common.js";
type GoalToolOptions = {
    agentSessionKey?: string;
    runSessionKey?: string;
    sessionAgentId?: string;
    config?: OpenClawConfig;
};
/** Creates the read-only tool that returns the current thread goal snapshot. */
export declare function createGetGoalTool(options: GoalToolOptions): AnyAgentTool;
/** Creates the tool that starts a new thread goal when explicitly requested. */
export declare function createCreateGoalTool(options: GoalToolOptions): AnyAgentTool;
/** Creates the tool that marks the current thread goal complete or blocked. */
export declare function createUpdateGoalTool(options: GoalToolOptions): AnyAgentTool;
export {};
