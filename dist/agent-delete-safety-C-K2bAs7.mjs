import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { o as resolveCanonicalWorkspacePath } from "./workspace-state-identity-hZ7UINpz.mjs";
import "./session-key-CSDERtm3.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { l as resolveSharedAuthStoreOwnership } from "./path-resolve-21Orzn6B.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { i as resolveLegacyInheritedAuthAgentId } from "./legacy-inherited-auth-dir-BO2hiLXD.mjs";
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
