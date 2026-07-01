/** Pure helpers for doctor skill readiness repairs. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SkillStatusEntry, SkillStatusReport } from "../skills/discovery/status.js";
/** Returns allowed skills that are unusable in the current runtime environment. */
export declare function collectUnavailableAgentSkills(report: SkillStatusReport): SkillStatusEntry[];
export declare function formatMissingSkillSummary(skill: SkillStatusEntry): string;
/** Disables unavailable skills in config while preserving existing skill entries. */
export declare function disableUnavailableSkillsInConfig(config: OpenClawConfig, skills: readonly SkillStatusEntry[]): OpenClawConfig;
