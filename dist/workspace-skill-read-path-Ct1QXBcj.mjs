import { i as resolveSkillFileHost } from "./skill-file-host-CJXc2mOP.mjs";
import { URL } from "node:url";
import path from "node:path";
//#region src/skills/workspace-skill-read-path.ts
const WORKSPACE_SKILL_PROTOCOL = "workspace-skill:";
const WORKSPACE_SKILL_HOST = "workspace";
/** Keep model-facing workspace-host paths distinct from Gateway filesystem paths. */
function resolveSkillReadPath(skill, fileHost = resolveSkillFileHost(skill)) {
	const name = skill.name?.trim();
	if (fileHost !== "workspace" || !name || skill.filePath.startsWith("node://")) return skill.filePath;
	return `${WORKSPACE_SKILL_PROTOCOL}//${WORKSPACE_SKILL_HOST}/${encodeURIComponent(name)}/SKILL.md`;
}
function isWorkspaceSkillReadPath(value) {
	return value.startsWith(`${WORKSPACE_SKILL_PROTOCOL}//${WORKSPACE_SKILL_HOST}/`);
}
/** Map an admitted virtual read path back to this skill's host-owned source tree. */
function resolveWorkspaceSkillSourcePath(skill, requestedPath) {
	const name = skill.name?.trim();
	if (resolveSkillFileHost(skill) !== "workspace" || !name || !skill.baseDir || requestedPath.includes("\\")) return;
	let locator;
	try {
		locator = new URL(requestedPath);
	} catch {
		return;
	}
	if (locator.protocol !== WORKSPACE_SKILL_PROTOCOL || locator.hostname !== WORKSPACE_SKILL_HOST || locator.username || locator.password || locator.port || locator.search || locator.hash) return;
	const encodedParts = locator.pathname.split("/").slice(1);
	if (encodedParts.length < 2) return;
	let parts;
	try {
		parts = encodedParts.map((part) => decodeURIComponent(part));
	} catch {
		return;
	}
	if (parts[0] !== name || parts.slice(1).some((part) => !part || part === "." || part === ".." || /[/\\\0]/u.test(part))) return;
	const relative = parts.slice(1);
	if (relative.length === 1 && relative[0] === "SKILL.md") return skill.filePath;
	const syntax = !skill.baseDir.startsWith("/") && path.win32.isAbsolute(skill.baseDir) ? path.win32 : path.posix;
	if (!syntax.isAbsolute(skill.baseDir)) return;
	const baseDir = syntax.resolve(skill.baseDir);
	const sourcePath = syntax.resolve(baseDir, ...relative);
	const containment = syntax.relative(baseDir, sourcePath);
	return containment && !containment.startsWith(`..${syntax.sep}`) && containment !== ".." && !syntax.isAbsolute(containment) ? sourcePath : void 0;
}
//#endregion
export { resolveSkillReadPath as n, resolveWorkspaceSkillSourcePath as r, isWorkspaceSkillReadPath as t };
