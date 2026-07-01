import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { SkillEligibilityContext, SkillEntry, SkillSnapshot } from "../types.js";
/** Resolves skill entries embedded into a run payload into runtime-visible entries. */
export declare function resolveEmbeddedRunSkillEntries(params: {
    workspaceDir: string;
    config?: OpenClawConfig;
    agentId?: string;
    eligibility?: SkillEligibilityContext;
    skillsSnapshot?: SkillSnapshot;
    workspaceOnly?: boolean;
}): {
    shouldLoadSkillEntries: boolean;
    skillEntries: SkillEntry[];
};
