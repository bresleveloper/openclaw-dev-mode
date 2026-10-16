import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { S as isCronSessionKey } from "./session-key-C09ow4h0.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-CPayZwJR.mjs";
import { r as resolveSessionPermissionCoreToolPolicy } from "./session-permission-exec-mode-B_8rJnOA.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-DAGJ2iyt.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-Dk4uhhe-.mjs";
//#region src/gateway/session-workspace-roots.ts
function resolveSessionFileReadScope(cfg, agentId, entry, context) {
	if (!context?.fileToolsOnGatewayHost || !context.sessionKey.trim() || context.requireWorkspaceOnly || entry.repositoryWorkspaceId || entry.sandbox === "required" || isCronSessionKey(context.sessionKey) || isInternalSessionEffectsKey(context.sessionKey)) return "root";
	if (resolveSandboxRuntimeStatus({
		cfg,
		agentId,
		sessionKey: context.sessionKey,
		preparedSessionEntry: entry
	}).sandboxed) return "root";
	return (entry.permissionMode ? resolveSessionPermissionCoreToolPolicy({ mode: entry.permissionMode }).workspaceOnly : resolveEffectiveToolFsWorkspaceOnly({
		cfg,
		agentId
	})) ? "root" : "host";
}
/** One persisted workspace owner for file browsing, diff state, and media containment. */
function resolveSessionWorkspaceRoots(cfg, agentId, entry, readContext) {
	const spawnedCwd = normalizeOptionalString(entry.spawnedCwd);
	const spawnedWorkspaceDir = normalizeOptionalString(entry.spawnedWorkspaceDir);
	const checkoutPending = !spawnedCwd && !spawnedWorkspaceDir && Boolean(entry.pendingWorktree || entry.pendingProjectGitUrl);
	const configuredWorkspaceDir = spawnedCwd || spawnedWorkspaceDir || checkoutPending ? void 0 : normalizeOptionalString(resolveAgentWorkspaceDir(cfg, agentId));
	return {
		checkoutPending,
		readScope: checkoutPending ? "root" : resolveSessionFileReadScope(cfg, agentId, entry, readContext),
		spawnedCwd,
		root: spawnedWorkspaceDir ?? spawnedCwd ?? configuredWorkspaceDir,
		diffCwd: spawnedCwd ?? spawnedWorkspaceDir ?? configuredWorkspaceDir
	};
}
//#endregion
export { resolveSessionWorkspaceRoots as t };
