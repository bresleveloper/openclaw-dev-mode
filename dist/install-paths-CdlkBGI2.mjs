import { r as resolveSafeInstallDir } from "./install-safe-path-CvmSx2MJ.mjs";
import path from "node:path";
//#region src/skills/lifecycle/install-paths.ts
const VALID_SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
/** Normalizes a tracked slug without accepting traversal or path separators. */
function normalizeTrackedSkillSlug(raw) {
	const slug = raw.trim();
	if (!slug || slug.includes("/") || slug.includes("\\") || slug.includes("..")) throw new Error(`Invalid skill slug: ${raw}`);
	return slug;
}
function validateRequestedSkillSlug(raw) {
	const slug = normalizeTrackedSkillSlug(raw);
	if (!VALID_SLUG_PATTERN.test(slug)) throw new Error(`Invalid skill slug: ${raw}`);
	return slug;
}
function resolveWorkspaceSkillInstallDir(workspaceDir, slug) {
	const skillsDir = path.join(path.resolve(workspaceDir), "skills");
	const target = resolveSafeInstallDir({
		baseDir: skillsDir,
		id: slug,
		invalidNameMessage: "invalid skill target path"
	});
	if (!target.ok) throw new Error(target.error);
	return target.path;
}
//#endregion
export { resolveWorkspaceSkillInstallDir as n, validateRequestedSkillSlug as r, normalizeTrackedSkillSlug as t };
