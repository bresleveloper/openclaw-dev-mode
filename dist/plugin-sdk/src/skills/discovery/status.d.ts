import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { RequirementConfigCheck, Requirements } from "../../shared/requirements.js";
import { type ClawHubSkillStatusLink, type LocalSkillCardStatus } from "../lifecycle/clawhub.js";
import type { SkillEntry, SkillEligibilityContext, SkillInstallSpec } from "../types.js";
type SkillStatusConfigCheck = RequirementConfigCheck;
type SkillInstallOption = {
    id: string;
    kind: SkillInstallSpec["kind"];
    label: string;
    bins: string[];
};
export type SkillStatusEntry = {
    name: string;
    description: string;
    source: string;
    bundled: boolean;
    filePath: string;
    baseDir: string;
    skillKey: string;
    primaryEnv?: string;
    emoji?: string;
    homepage?: string;
    always: boolean;
    disabled: boolean;
    blockedByAllowlist: boolean;
    blockedByAgentFilter: boolean;
    eligible: boolean;
    /**
     * True when the skill declares an OS requirement that does not include the
     * current platform (e.g. a macOS-only skill on Linux/Windows). Such skills are
     * inapplicable by design rather than broken installs, so callers can surface
     * them separately from genuine "missing requirements".
     */
    platformIncompatible: boolean;
    modelVisible: boolean;
    userInvocable: boolean;
    commandVisible: boolean;
    requirements: Requirements;
    missing: Requirements;
    configChecks: SkillStatusConfigCheck[];
    install: SkillInstallOption[];
    clawhub?: ClawHubSkillStatusLink;
    skillCard?: LocalSkillCardStatus;
};
export type SkillStatusReport = {
    workspaceDir: string;
    managedSkillsDir: string;
    agentId?: string;
    agentSkillFilter?: string[];
    skills: SkillStatusEntry[];
};
export declare function resolveSkillStatusEntry(skills: readonly SkillStatusEntry[], requestedName: string): SkillStatusEntry | null;
export declare function buildWorkspaceSkillStatus(workspaceDir: string, opts?: {
    config?: OpenClawConfig;
    managedSkillsDir?: string;
    entries?: SkillEntry[];
    eligibility?: SkillEligibilityContext;
    agentId?: string;
}): SkillStatusReport;
export {};
