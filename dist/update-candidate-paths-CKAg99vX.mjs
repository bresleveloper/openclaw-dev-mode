import { o as normalizeWindowsPathPreservingCase, r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { Fn as object, Jn as string, Nt as array, Yt as discriminatedUnion, nr as tuple, xn as literal } from "./schemas-BOYIvvln.mjs";
import { i as isAvatarWorkspacePath } from "./avatar-policy-DiIdI6oM.mjs";
import path from "node:path";
//#region src/infra/update-candidate-paths.ts
const UPDATE_CANDIDATE_PLUGIN_PLAN_FILENAME = "plugin-copy-plan.json";
const UpdateStateDatabaseOwnerSchema = discriminatedUnion("role", [object({ role: literal("global") }), object({
	role: literal("agent"),
	agentId: string().min(1)
})]);
/** Every raw spelling discovered for one database, grouped by projection identity. */
const StateDatabaseDiscoverySchema = object({
	spellings: tuple([string()], string()),
	owners: array(UpdateStateDatabaseOwnerSchema).optional()
});
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
function queueStateDatabaseSpelling(files, stateRoot, file, owner) {
	const identity = resolveUpdateCandidateStateIdentity(stateRoot, file);
	const discovery = files.get(identity);
	if (discovery) {
		if (!discovery.spellings.includes(file)) discovery.spellings.push(file);
		if (owner && !discovery.owners?.some((current) => current.role === owner.role && (current.role === "global" || owner.role === "agent" && current.agentId === owner.agentId))) (discovery.owners ??= []).push(owner);
		return;
	}
	files.set(identity, {
		spellings: [file],
		...owner ? { owners: [owner] } : {}
	});
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
/**
* Validation confines workspace-path avatars to the agent workspace, which the
* candidate relocates. Rebase them against the source workspace so the
* candidate accepts exactly the avatars the source did.
*/
function resolveUpdateCandidateAvatar(sourceWorkspaceDir, avatar) {
	const value = avatar.trim();
	if (!isAvatarWorkspacePath(value)) return avatar;
	const workspaceRoot = path.resolve(sourceWorkspaceDir);
	const resolved = path.resolve(workspaceRoot, value);
	if (!isPathInside(workspaceRoot, resolved)) return resolved;
	const plain = (input) => process.platform === "win32" ? normalizeWindowsPathPreservingCase(input) : input;
	return `.${path.sep}${path.relative(plain(workspaceRoot), plain(resolved))}`;
}
//#endregion
export { resolveUpdateCandidateAvatar as a, resolveUpdateCandidateStateIdentity as c, queueStateDatabaseSpelling as i, resolveUpdateCandidateStatePath as l, UPDATE_CANDIDATE_PLUGIN_PLAN_FILENAME as n, resolveUpdateCandidatePluginPath as o, UpdateStateDatabaseOwnerSchema as r, resolveUpdateCandidatePluginSourcePath as s, StateDatabaseDiscoverySchema as t };
