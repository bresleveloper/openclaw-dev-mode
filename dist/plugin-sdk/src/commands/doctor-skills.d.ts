import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SkillStatusEntry } from "../skills/discovery/status.js";
import { type GhConfigDiscoveryInput } from "../skills/lifecycle/gh-config-discovery.js";
import type { DoctorPrompter } from "./doctor-prompter.js";
export { collectUnavailableAgentSkills, disableUnavailableSkillsInConfig, } from "./doctor-skills-core.js";
/** Builds a GitHub CLI config-dir hint for eligible GitHub skill setups. */
export declare function describeGhConfigDirHint(skills: SkillStatusEntry[]): string[];
/** Builds a GitHub CLI config-dir hint from injected discovery inputs for tests. */
export declare function describeGhConfigDirHintFromDiscovery(skills: SkillStatusEntry[], discoveryInput: GhConfigDiscoveryInput): string[];
/** Formats doctor note lines for skills that are allowed but unavailable. */
export declare function formatUnavailableSkillDoctorLines(skills: SkillStatusEntry[]): string[];
/** Checks default-agent skill readiness and optionally disables unavailable skills in config. */
export declare function maybeRepairSkillReadiness(params: {
    cfg: OpenClawConfig;
    prompter: DoctorPrompter;
}): Promise<OpenClawConfig>;
