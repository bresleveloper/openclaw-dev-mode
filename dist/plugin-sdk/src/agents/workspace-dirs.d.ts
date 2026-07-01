/**
 * Agent workspace directory collection.
 *
 * File sync and cleanup paths use this to enumerate configured agent workspaces
 * plus the default agent workspace without duplicating agent-scope logic.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Lists unique workspace directories for configured agents and the default agent. */
export declare function listAgentWorkspaceDirs(cfg: OpenClawConfig): string[];
