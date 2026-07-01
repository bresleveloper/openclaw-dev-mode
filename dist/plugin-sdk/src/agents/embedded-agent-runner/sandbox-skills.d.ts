import type { SkillEligibilityContext, SkillSnapshot } from "../../skills/types.js";
import type { SkillEntry } from "../../skills/types.js";
import type { SandboxContext } from "../sandbox/types.js";
type SandboxSkillRuntimeContext = Pick<SandboxContext, "enabled"> & Partial<Pick<SandboxContext, "skillsEligibility" | "skillsWorkspaceDir" | "containerWorkdir" | "workspaceAccess">>;
export declare function mapSandboxSkillEntriesForPrompt(params: {
    entries?: SkillEntry[];
    skillsWorkspaceDir: string;
    skillsPromptWorkspaceDir: string;
}): SkillEntry[] | undefined;
export declare function resolveSandboxSkillRuntimeInputs(params: {
    sandbox?: SandboxSkillRuntimeContext | null;
    effectiveWorkspace: string;
    skillsSnapshot?: SkillSnapshot;
}): {
    skillsEligibility?: SkillEligibilityContext;
    skillsPromptWorkspaceDir: string;
    skillsSnapshot?: SkillSnapshot;
    skillsWorkspaceDir: string;
    workspaceOnly: boolean;
};
export {};
