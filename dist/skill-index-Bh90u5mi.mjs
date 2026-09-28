//#region src/skills/discovery/skill-index.ts
/** Normalizes a skill name to the comparable key used by filters and commands. */
function normalizeSkillIndexName(value) {
	return value.trim().toLowerCase().replace(/[\s_/]+/g, "-").replace(/[^a-z0-9-]+/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}
function isSkillPromptVisible(entry) {
	if (entry.exposure) return entry.exposure.includeInAvailableSkillsPrompt ?? true;
	if (entry.invocation) return !entry.invocation.disableModelInvocation;
	return !entry.skill.disableModelInvocation;
}
function isSkillUserInvocable(entry) {
	if (entry.exposure) return entry.exposure.userInvocable ?? true;
	if (entry.invocation) return entry.invocation.userInvocable ?? true;
	return true;
}
function filterPromptVisibleSkillEntries(entries) {
	return entries.filter(isSkillPromptVisible);
}
function filterUserInvocableSkillEntries(entries) {
	return entries.filter(isSkillUserInvocable);
}
//#endregion
export { normalizeSkillIndexName as a, isSkillUserInvocable as i, filterUserInvocableSkillEntries as n, isSkillPromptVisible as r, filterPromptVisibleSkillEntries as t };
