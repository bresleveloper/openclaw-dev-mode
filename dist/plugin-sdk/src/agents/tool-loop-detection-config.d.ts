/**
 * Tool loop-detection config resolver.
 * Overlays per-agent loop detection settings on global tool defaults while
 * preserving nested detector and post-compaction guard fields.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ToolLoopDetectionConfig } from "../config/types.tools.js";
/** Resolves effective tool loop-detection config by overlaying agent settings on globals. */
export declare function resolveToolLoopDetectionConfig(params: {
    cfg?: OpenClawConfig;
    agentId?: string;
}): ToolLoopDetectionConfig | undefined;
