import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { _ as resolveConfigDir } from "./utils-DgZn2dLu.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { _ as resolveDeliveryQueueMediaDir } from "./paths-DGIwWbpu.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { t as resolveEffectiveToolFsRootExpansionAllowed } from "./tool-fs-policy-DAGJ2iyt.mjs";
import { t as resolveLocalMediaPath } from "./local-media-path-DneQarct.mjs";
import path from "node:path";
//#region src/media/local-roots.ts
let cachedPreferredTmpDir;
function resolveCanonicalRoot(root) {
	return resolvePathViaExistingAncestorSync(path.resolve(root));
}
function resolveCachedPreferredTmpDir() {
	if (!cachedPreferredTmpDir) cachedPreferredTmpDir = resolvePreferredOpenClawTmpDir();
	return cachedPreferredTmpDir;
}
function buildMediaLocalRoots(stateDir, configDir) {
	const resolvedStateDir = path.resolve(stateDir);
	const resolvedConfigDir = path.resolve(configDir);
	const preferredTmpDir = resolveCachedPreferredTmpDir();
	return Array.from(/* @__PURE__ */ new Set([
		preferredTmpDir,
		path.join(resolvedConfigDir, "media"),
		path.join(resolvedStateDir, "media"),
		resolveDeliveryQueueMediaDir(resolvedStateDir),
		path.join(resolvedStateDir, "canvas"),
		path.join(resolvedStateDir, "workspace"),
		path.join(resolvedStateDir, "sandboxes")
	]));
}
/** Returns the process default roots where local media reads may resolve generated/cache files. */
function getDefaultMediaLocalRoots() {
	return buildMediaLocalRoots(resolveStateDir(), resolveConfigDir());
}
/**
* Drops shared isolation parents from a media root list.
*
* Roots overlapping the shared `<state>/sandboxes` parent are removed unless they live inside the
* supplied session workspace, so sibling sandboxes and the shared parent itself never re-enter the
* allowlist through base construction or source-parent expansion. The shared `<state>/workspace`
* parent is removed only when the caller supplies a session workspace outside it (a sandboxed
* session); callers without session context keep the legacy shared-workspace grant.
*/
function filterSharedMediaLocalRoots(roots, context) {
	const sandboxesDir = resolveCanonicalRoot(path.join(context.resolvedStateDir, "sandboxes"));
	const workspaceDir = resolveCanonicalRoot(path.join(context.resolvedStateDir, "workspace"));
	const sessionWorkspaceDir = context.sessionWorkspaceDir ? resolveCanonicalRoot(context.sessionWorkspaceDir) : void 0;
	const validSessionWorkspaceDir = sessionWorkspaceDir !== void 0 && !isPathInside(sessionWorkspaceDir, sandboxesDir) ? sessionWorkspaceDir : void 0;
	const overlaps = (sharedDir, root) => isPathInside(sharedDir, root) || isPathInside(root, sharedDir);
	const filtered = [];
	for (const root of roots) {
		const resolvedRoot = resolveCanonicalRoot(root);
		const withinSessionWorkspace = validSessionWorkspaceDir !== void 0 && isPathInside(validSessionWorkspaceDir, resolvedRoot);
		if (overlaps(sandboxesDir, resolvedRoot) && !withinSessionWorkspace) continue;
		if (sessionWorkspaceDir !== void 0 && overlaps(workspaceDir, resolvedRoot) && !withinSessionWorkspace) continue;
		filtered.push(resolvedRoot);
	}
	return filtered;
}
/**
* Default local media roots with shared isolation parents removed.
*
* Inbound attachment processing must not inherit sibling-sandbox grants from the process default
* list; callers re-add their own session/agent workspace explicitly when one applies.
*/
function getSessionSafeDefaultMediaLocalRoots(sessionWorkspaceDir) {
	return filterSharedMediaLocalRoots(getDefaultMediaLocalRoots(), {
		resolvedStateDir: path.resolve(resolveStateDir()),
		sessionWorkspaceDir
	});
}
/**
* Adds exact agent/session workspaces without exposing shared agent or sandbox roots.
*
* Callers that need to send media from a sandbox must pass the authoritative active
* session workspace, not a path derived from the requested media source. Omitting that
* context intentionally denies sandbox files under workspace-only filesystem policy.
*/
function getAgentScopedMediaLocalRoots(cfg, agentId, sessionWorkspaceDir) {
	const stateDir = resolveStateDir();
	const resolvedStateDir = path.resolve(stateDir);
	const roots = filterSharedMediaLocalRoots(buildMediaLocalRoots(stateDir, resolveConfigDir()), {
		resolvedStateDir,
		sessionWorkspaceDir
	});
	const normalizedAgentId = normalizeOptionalString(agentId);
	const workspaceDir = normalizeOptionalString(sessionWorkspaceDir) ?? (normalizedAgentId ? resolveAgentWorkspaceDir(cfg, normalizedAgentId) : void 0);
	if (!workspaceDir) return roots;
	const normalizedWorkspaceDir = resolveCanonicalRoot(workspaceDir);
	if (normalizedWorkspaceDir === resolveCanonicalRoot(path.join(resolvedStateDir, "sandboxes"))) return roots;
	if (!roots.includes(normalizedWorkspaceDir)) roots.push(normalizedWorkspaceDir);
	return roots;
}
/** Adds only concrete local source parent directories to an existing root allowlist. */
function appendLocalMediaParentRoots(roots, mediaSources) {
	const appended = uniqueStrings(roots.map((root) => path.resolve(root)));
	for (const source of mediaSources ?? []) {
		const localPath = resolveLocalMediaPath(source);
		if (!localPath) continue;
		const parentDir = path.dirname(localPath);
		if (parentDir === path.parse(parentDir).root) continue;
		const normalizedParent = resolveCanonicalRoot(parentDir);
		if (!appended.includes(normalizedParent)) appended.push(normalizedParent);
	}
	return appended;
}
/**
* Resolves outbound media roots, expanding for local sources only when filesystem policy allows it.
* Pass `sessionWorkspaceDir` from trusted session context to retain access to that exact sandbox.
*/
function getAgentScopedMediaLocalRootsForSources(params) {
	const roots = getAgentScopedMediaLocalRoots(params.cfg, params.agentId, params.sessionWorkspaceDir);
	if (!resolveEffectiveToolFsRootExpansionAllowed(params)) return roots;
	const expanded = appendLocalMediaParentRoots(roots, params.mediaSources);
	const addedParents = expanded.filter((root) => !roots.includes(root));
	const confinedParents = filterSharedMediaLocalRoots(addedParents, {
		resolvedStateDir: path.resolve(resolveStateDir()),
		sessionWorkspaceDir: params.sessionWorkspaceDir
	});
	if (confinedParents.length === addedParents.length) return expanded;
	return Array.from(/* @__PURE__ */ new Set([...roots, ...confinedParents]));
}
//#endregion
export { getSessionSafeDefaultMediaLocalRoots as a, getDefaultMediaLocalRoots as i, getAgentScopedMediaLocalRoots as n, getAgentScopedMediaLocalRootsForSources as r, appendLocalMediaParentRoots as t };
