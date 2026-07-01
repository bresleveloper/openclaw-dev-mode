import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type SkillProposalActionInput, type SkillProposalApplyResult, type SkillProposalCreateInput, type SkillProposalManifest, type SkillProposalReadResult, type SkillProposalRecord, type SkillProposalReviseInput, type SkillProposalSupportFileInput, type SkillProposalUpdateInput } from "./types.js";
type SkillWorkshopWorkspaceOptions = {
    config?: OpenClawConfig;
    agentId?: string;
};
type SkillProposalScopeOptions = {
    workspaceDir?: string;
};
/** Lists skill workshop proposals, optionally scoped to a workspace. */
export declare function listSkillProposals(options?: SkillProposalScopeOptions): Promise<SkillProposalManifest>;
export declare function readSkillProposalDraftFile(filePath: string): Promise<string>;
export declare function readSkillProposalDraftDirectory(dirPath: string): Promise<{
    content: string;
    supportFiles: SkillProposalSupportFileInput[];
}>;
export declare function inspectSkillProposal(proposalId: string, options?: SkillProposalScopeOptions): Promise<SkillProposalReadResult | null>;
export declare function resolvePendingSkillProposal(input: {
    proposalId?: string;
    name?: string;
    workspaceDir?: string;
}): Promise<SkillProposalReadResult>;
export declare function proposeCreateSkill(input: SkillProposalCreateInput): Promise<SkillProposalReadResult>;
export declare function proposeUpdateSkill(input: SkillProposalUpdateInput & SkillWorkshopWorkspaceOptions): Promise<SkillProposalReadResult>;
export declare function reviseSkillProposal(input: SkillProposalReviseInput): Promise<SkillProposalReadResult>;
export declare function rejectSkillProposal(input: SkillProposalActionInput): Promise<SkillProposalRecord>;
export declare function quarantineSkillProposal(input: SkillProposalActionInput): Promise<SkillProposalRecord>;
export declare function applySkillProposal(input: SkillProposalActionInput): Promise<SkillProposalApplyResult>;
export {};
