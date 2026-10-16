//#region src/skills/discovery/skill-index.ts
/** Normalizes a skill name to the comparable key used by filters and commands. */
function normalizeSkillIndexName(value) {
	return value.trim().toLowerCase().replace(/[\s_/]+/g, "-").replace(/[^a-z0-9-]+/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}
function isSkillPromptVisible(entry) {
	if (entry.exposure) return entry.exposure.includeInAvailableSkillsPrompt ?? true;
	return !(entry.invocation ?? entry.skill).disableModelInvocation;
}
function isSkillUserInvocable(entry) {
	return (entry.exposure ?? entry.invocation)?.userInvocable ?? true;
}
//#endregion
export { isSkillUserInvocable as n, normalizeSkillIndexName as r, isSkillPromptVisible as t };
