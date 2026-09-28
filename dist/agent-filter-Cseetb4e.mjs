import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { o as resolveAgentEntry } from "./agent-scope-config-IQKOEtZ4.mjs";
//#region src/skills/discovery/filter.ts
/** Normalizes an optional skill filter while preserving undefined as "not configured". */
function normalizeSkillFilter(skillFilter) {
	if (skillFilter === void 0) return;
	return normalizeStringEntries(skillFilter);
}
function normalizeSkillFilterForComparison(skillFilter) {
	const normalized = normalizeSkillFilter(skillFilter);
	if (normalized === void 0) return;
	return new Set(normalized);
}
function matchesSkillFilter(cached, next) {
	const cachedNormalized = normalizeSkillFilterForComparison(cached);
	const nextNormalized = normalizeSkillFilterForComparison(next);
	if (cachedNormalized === void 0 || nextNormalized === void 0) return cachedNormalized === nextNormalized;
	if (cachedNormalized.size !== nextNormalized.size) return false;
	for (const entry of cachedNormalized) if (!nextNormalized.has(entry)) return false;
	return true;
}
//#endregion
//#region src/skills/discovery/agent-filter.ts
/**
* Explicit per-agent skills win when present; otherwise fall back to shared defaults.
* Unknown agent ids also fall back to defaults so legacy/unresolved callers do not widen access.
*/
function resolveEffectiveAgentSkillFilter(cfg, agentId) {
	if (!cfg) return;
	const agentEntry = agentId ? resolveAgentEntry(cfg, agentId) : void 0;
	if (agentEntry && Object.hasOwn(agentEntry, "skills")) return normalizeSkillFilter(agentEntry.skills);
	return normalizeSkillFilter(cfg.agents?.defaults?.skills);
}
function resolveEffectiveAgentSkillsLimits(cfg, agentId) {
	if (!cfg || !agentId) return;
	const agentEntry = resolveAgentEntry(cfg, agentId);
	if (!agentEntry || !Object.hasOwn(agentEntry, "skillsLimits")) return;
	const { maxSkillsPromptChars } = agentEntry.skillsLimits ?? {};
	return typeof maxSkillsPromptChars === "number" ? { maxSkillsPromptChars } : void 0;
}
/** Applies a session's sparse skill overlay after agent/default allowlist resolution. */
function isSessionSkillEnabled(skillName, baseFilter, overrides, skillKey = skillName) {
	const override = overrides && Object.hasOwn(overrides, skillKey) ? overrides[skillKey] : void 0;
	const baseAllows = baseFilter === void 0 || baseFilter.includes(skillName);
	return override === true || baseAllows && override !== false;
}
//#endregion
export { normalizeSkillFilter as a, matchesSkillFilter as i, resolveEffectiveAgentSkillFilter as n, resolveEffectiveAgentSkillsLimits as r, isSessionSkillEnabled as t };
