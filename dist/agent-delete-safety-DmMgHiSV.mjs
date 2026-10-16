import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { o as resolveCanonicalWorkspacePath } from "./workspace-state-identity-EPAs22n_.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { o as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { o as resolveSharedAuthStoreOwnership } from "./path-resolve-CIRhdX6A.mjs";
import { i as resolveLegacyInheritedAuthAgentId } from "./legacy-inherited-auth-dir-DmZI0WMx.mjs";
//#region src/agents/agent-delete-safety.ts
/** True when deleting this agent database would remove the legacy shared auth store. */
function isSharedAuthStoreOwner(params) {
	return params.ownership.location === "legacy-main" && isSameOpenClawAgentDatabasePath(params.agentAuthDbPath, params.sharedAuthDbPath);
}
function formatSharedAuthStoreOwnerDeleteError(agentId) {
	return `Agent "${agentId}" owns the legacy shared auth store and cannot be deleted. Run openclaw doctor --fix to migrate shared auth, then retry.`;
}
function isInheritedAuthStoreOwner(cfg, agentId) {
	if (!cfg.agents?.defaults?.authInheritance?.agentId?.trim() && resolveSharedAuthStoreOwnership().location !== "legacy-main") return false;
	return agentId === normalizeAgentId(resolveLegacyInheritedAuthAgentId(cfg));
}
function workspacePathsOverlap(left, right) {
	const normalizedLeft = resolveCanonicalWorkspacePath(left.replaceAll("\0", ""));
	const normalizedRight = resolveCanonicalWorkspacePath(right.replaceAll("\0", ""));
	return isPathInside(normalizedRight, normalizedLeft) || isPathInside(normalizedLeft, normalizedRight);
}
/** Lists other agents whose workspaces overlap a candidate delete target. */
function findOverlappingWorkspaceAgentIds(cfg, agentId, workspaceDir, env) {
	const entries = listAgentEntries(cfg);
	const normalizedAgentId = normalizeAgentId(agentId);
	const overlappingAgentIds = [];
	for (const entry of entries) {
		const otherAgentId = normalizeAgentId(entry.id);
		if (otherAgentId === normalizedAgentId) continue;
		if (workspacePathsOverlap(workspaceDir, resolveAgentWorkspaceDir(cfg, otherAgentId, env))) overlappingAgentIds.push(otherAgentId);
	}
	return overlappingAgentIds;
}
//#endregion
export { isSharedAuthStoreOwner as i, formatSharedAuthStoreOwnerDeleteError as n, isInheritedAuthStoreOwner as r, findOverlappingWorkspaceAgentIds as t };
