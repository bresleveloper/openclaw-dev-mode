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
//#endregion
export { recordSkillFileHost as n, resolveSkillFileHost as r, clearSkillFileHost as t };
