//#region src/skills/discovery/skill-command-provenance.ts
const fileHosts = /* @__PURE__ */ new WeakMap();
const selectionFileHosts = /* @__PURE__ */ new WeakMap();
function recordSkillCommandFileHost(command, host) {
	fileHosts.set(command, host);
}
function resolveSkillCommandFileHost(command) {
	return fileHosts.get(command);
}
function recordExplicitSkillSelectionFileHost(selection, host) {
	selectionFileHosts.set(selection, host);
	return selection;
}
function resolveExplicitSkillSelectionFileHost(selection) {
	return selectionFileHosts.get(selection);
}
function copyExplicitSkillSelectionFileHost(source, target) {
	const host = resolveExplicitSkillSelectionFileHost(source);
	return host ? recordExplicitSkillSelectionFileHost(target, host) : target;
}
//#endregion
export { resolveSkillCommandFileHost as a, resolveExplicitSkillSelectionFileHost as i, recordExplicitSkillSelectionFileHost as n, recordSkillCommandFileHost as r, copyExplicitSkillSelectionFileHost as t };
