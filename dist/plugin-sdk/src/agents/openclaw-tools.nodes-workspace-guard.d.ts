import type { ToolFsPolicy } from "./tool-fs-policy.js";
import type { AnyAgentTool } from "./tools/common.js";
/** Wraps the nodes tool with a workspace-only output-path guard when policy requires it. */
export declare function applyNodesToolWorkspaceGuard(nodesToolBase: AnyAgentTool, options: {
    fsPolicy?: ToolFsPolicy;
    sandboxContainerWorkdir?: string;
    sandboxRoot?: string;
    workspaceDir: string;
}): AnyAgentTool;
