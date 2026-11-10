import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { S as isCronSessionKey } from "./session-key-CSDERtm3.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { i as resolveSessionPermissionCoreToolPolicy } from "./session-permission-exec-mode-orsENUww.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-B6hhdgLR.mjs";
import { r as resolveSandboxRuntimeStatus } from "./runtime-status-DWm-5zUj.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-C65zBDHN.mjs";
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
	if (entry.deviceFolder) return {
		checkoutPending: false,
		readScope: "root",
		spawnedCwd: void 0,
		root: void 0,
		diffCwd: void 0
	};
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
