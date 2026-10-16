//#region src/skills/skill-file-host.ts
function recordSkillFileHost(skill, host) {
	return Object.assign(skill, { fileHost: host });
}
function resolveSkillFileHost(skill) {
	return skill.fileHost;
}
function clearSkillFileHost(skill) {
	Reflect.deleteProperty(skill, "fileHost");
	return skill;
}
function copySkillFileHost(source, target) {
	const host = resolveSkillFileHost(source);
	return host ? recordSkillFileHost(target, host) : target;
}
//#endregion
export { resolveSkillFileHost as i, copySkillFileHost as n, recordSkillFileHost as r, clearSkillFileHost as t };
