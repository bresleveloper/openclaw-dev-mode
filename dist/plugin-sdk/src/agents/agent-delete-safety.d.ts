import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Lists other agents whose workspaces overlap a candidate delete target. */
export declare function findOverlappingWorkspaceAgentIds(cfg: OpenClawConfig, agentId: string, workspaceDir: string): string[];
