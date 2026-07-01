import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { SkillEligibilityContext, SkillSnapshot } from "../types.js";
/** Inputs that make a resolved skill snapshot reusable within a process. */
export type ReusableSkillSnapshotParams = {
    workspaceDir: string;
    config: OpenClawConfig;
    agentId?: string;
    skillFilter?: string[];
    eligibility?: SkillEligibilityContext;
    existingSnapshot?: SkillSnapshot;
    snapshotVersion?: number;
    watch?: boolean;
    hydrateExisting?: boolean;
};
export type ReusableSkillSnapshotResult = {
    snapshot: SkillSnapshot;
    shouldRefresh: boolean;
    snapshotVersion: number;
};
export declare function resetResolvedSkillsCacheForTests(): void;
export declare function resolveReusableWorkspaceSkillSnapshot(params: ReusableSkillSnapshotParams): ReusableSkillSnapshotResult;
