import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { AnyAgentTool } from "./tools/common.js";
/**
 * Registration helpers for optional OpenClaw-owned tools.
 *
 * This keeps model/runtime gating separate from tool construction so callers can
 * assemble candidate tools first, then filter by config and execution contract.
 */
/** Drops disabled optional tools while preserving candidate order. */
export declare function collectPresentOpenClawTools(candidates: readonly (AnyAgentTool | null | undefined)[]): AnyAgentTool[];
/** Decides whether update_plan should be included in the assembled OpenClaw tool set. */
export declare function shouldIncludeUpdatePlanToolForOpenClawTools(params: {
    config?: OpenClawConfig;
    agentSessionKey?: string;
    agentId?: string | null;
    modelProvider?: string;
    modelId?: string;
    pluginToolAllowlist?: string[];
    pluginToolDenylist?: string[];
}): boolean;
