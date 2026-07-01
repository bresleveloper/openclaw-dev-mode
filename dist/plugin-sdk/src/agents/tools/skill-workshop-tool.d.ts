import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { SkillProposalOrigin } from "../../skills/workshop/types.js";
import { type AnyAgentTool } from "./common.js";
export type SkillWorkshopToolOptions = {
    workspaceDir: string;
    config?: OpenClawConfig;
    agentId?: string;
    origin?: SkillProposalOrigin;
};
/** Create the Skill Workshop tool for proposal discovery and lifecycle actions. */
export declare function createSkillWorkshopTool(options: SkillWorkshopToolOptions): AnyAgentTool;
