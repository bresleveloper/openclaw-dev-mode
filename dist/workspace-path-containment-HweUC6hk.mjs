import { n as isNotFoundPathError, r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { O as listAgentIds, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./agent-scope-CTuYDtny.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/gateway/server-methods/workspace-path-containment.ts
async function resolveRequestedRealPath(requestedPath, allowMissing) {
	try {
		return await fs$1.realpath(requestedPath);
	} catch (error) {
		if (!allowMissing || !isNotFoundPathError(error)) return null;
	}
	let ancestor = path.dirname(requestedPath);
	for (;;) {
		try {
			const ancestorRealPath = await fs$1.realpath(ancestor);
			return path.resolve(ancestorRealPath, path.relative(ancestor, requestedPath));
		} catch (error) {
			if (!isNotFoundPathError(error)) return null;
		}
		const parent = path.dirname(ancestor);
		if (parent === ancestor) return null;
		ancestor = parent;
	}
}
/** Resolves a Gateway path against the real roots of configured agent workspaces. */
async function resolveWorkspacePathContainment(requestedPath, cfg, options = {}) {
	const workspaceRoots = await Promise.all(listAgentIds(cfg).map(async (agentId) => {
		try {
			return await fs$1.realpath(resolveAgentWorkspaceDir(cfg, agentId));
		} catch {
			return null;
		}
	}));
	if (requestedPath === void 0) {
		const firstWorkspaceRoot = workspaceRoots[0];
		return firstWorkspaceRoot ? {
			path: firstWorkspaceRoot,
			workspaceRoot: firstWorkspaceRoot
		} : null;
	}
	const existingRoots = workspaceRoots.filter((root) => root !== null);
	if (!path.isAbsolute(requestedPath)) return null;
	const requestedRealPath = await resolveRequestedRealPath(path.resolve(requestedPath), options.allowMissing === true);
	if (!requestedRealPath) return null;
	const workspaceRoot = existingRoots.filter((root) => isPathInside(root, requestedRealPath)).toSorted((left, right) => right.length - left.length)[0];
	return workspaceRoot ? {
		path: requestedRealPath,
		workspaceRoot
	} : null;
}
/** Revalidates an async containment result against the current workspace configuration. */
function isWorkspacePathContainmentCurrent(containment, cfg) {
	return listAgentIds(cfg).some((agentId) => {
		try {
			const currentRoot = fs.realpathSync(resolveAgentWorkspaceDir(cfg, agentId));
			return currentRoot === containment.workspaceRoot && isPathInside(currentRoot, containment.path);
		} catch {
			return false;
		}
	});
}
//#endregion
export { resolveWorkspacePathContainment as n, isWorkspacePathContainmentCurrent as t };
