import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Runtime configuration for the skill workshop proposal flow. */
export type SkillWorkshopConfig = {
    autonomous: {
        enabled: boolean;
    };
    allowSymlinkTargetWrites: boolean;
    approvalPolicy: "pending" | "auto";
    maxPending: number;
    maxSkillBytes: number;
};
export declare function resolveSkillWorkshopConfig(config?: OpenClawConfig): SkillWorkshopConfig;
