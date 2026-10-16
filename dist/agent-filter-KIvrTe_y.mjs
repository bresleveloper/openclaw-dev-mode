import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { o as resolveAgentEntry } from "./agent-scope-config-CDYpzA0r.mjs";
//#region src/skills/discovery/filter.ts
/** Normalizes an optional skill filter while preserving undefined as "not configured". */
function normalizeSkillFilter(skillFilter) {
	if (skillFilter === void 0) return;
	return normalizeStringEntries(skillFilter);
}
function matchesSkillFilter(cached, next) {
	const cachedNormalized = normalizeSkillFilter(cached);
	const nextNormalized = normalizeSkillFilter(next);
	if (cachedNormalized === void 0 || nextNormalized === void 0) return cachedNormalized === nextNormalized;
	const nextEntries = new Set(nextNormalized);
	return new Set(cachedNormalized).size === nextEntries.size && cachedNormalized.every((entry) => nextEntries.has(entry));
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
