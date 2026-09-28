import { o as normalizeWindowsPathPreservingCase, r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import path from "node:path";
//#region src/infra/update-candidate-paths.ts
const UPDATE_CANDIDATE_PLUGIN_PLAN_FILENAME = "plugin-copy-plan.json";
/**
* One projection identity per locator, matching the raw canonical-spelling
* eligibility of the rebase branch in resolveUpdateCandidateStatePath: only
* canonically spelled in-root aliases take their case-preserving plain
* spelling; external and noncanonical locators keep their raw spelling.
* Discovery dedupes on this identity so the copy and the registry rebound
* write always agree on one destination for every spelling of a database.
*/
function resolveUpdateCandidateStateIdentity(sourceRoot, source) {
	return process.platform === "win32" && path.normalize(source) === source && isPathInside(sourceRoot, source) ? normalizeWindowsPathPreservingCase(source) : source;
}
/** Shared with config projection so custom agent directories use their copied database. */
function resolveUpdateCandidateStatePath(sourceRoot, targetRoot, source) {
	if (path.normalize(source) === source && isPathInside(sourceRoot, source)) {
		const projectionRoot = process.platform === "win32" ? normalizeWindowsPathPreservingCase(sourceRoot) : sourceRoot;
		return path.join(targetRoot, path.relative(projectionRoot, resolveUpdateCandidateStateIdentity(sourceRoot, source)));
	}
	return path.join(targetRoot, "candidate-external", sha256Hex(source));
}
/** Plugin locators cannot overwrite the separately snapshotted state databases. */
function resolveUpdateCandidatePluginPath(sourceRoot, targetRoot, source) {
	return ["npm", "extensions"].some((directory) => isPathInside(path.join(sourceRoot, directory), source)) ? resolveUpdateCandidateStatePath(sourceRoot, targetRoot, source) : path.join(targetRoot, "candidate-plugins", sha256Hex(path.parse(source).root), path.relative(path.parse(source).root, source));
}
/** Decode the ancestry retained by published drivers for external plugin copies. */
function resolveUpdateCandidatePluginSourcePath(rehearsalRoot, copiedPath) {
	const root = path.parse(copiedPath).root;
	const namespace = path.join(rehearsalRoot, "candidate-plugins", sha256Hex(root));
	if (!root || path.normalize(copiedPath) !== copiedPath || !isPathInside(namespace, copiedPath) || namespace === copiedPath) return;
	const source = path.join(root, path.relative(namespace, copiedPath));
	return resolveUpdateCandidatePluginPath(rehearsalRoot, rehearsalRoot, source) === copiedPath ? source : void 0;
}
//#endregion
export { resolveUpdateCandidateStatePath as a, resolveUpdateCandidateStateIdentity as i, resolveUpdateCandidatePluginPath as n, resolveUpdateCandidatePluginSourcePath as r, UPDATE_CANDIDATE_PLUGIN_PLAN_FILENAME as t };
