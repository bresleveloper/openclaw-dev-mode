import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { s as resolveCoreToolProfilePolicy } from "./tool-catalog-DGlfxTaj.mjs";
import { o as isToolAllowedByPolicies } from "./tool-policy-match--5jlhAPZ.mjs";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-B4OWlHAG.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-14GRhbFd.mjs";
import { i as resolveSessionPermissionCoreToolPolicy } from "./session-permission-exec-mode-orsENUww.mjs";
//#region src/agents/tool-fs-policy.ts
/** Capture the recorded boundary, or its resolved workspace when no root was pinned. */
function resolveStoredSessionPermissionPolicy(entry, resolvedWorkspace) {
	return entry?.permissionMode ? Object.freeze({
		mode: entry.permissionMode,
		root: entry.sessionRoot ?? resolvedWorkspace
	}) : void 0;
}
function resolveToolFsConfig(params) {
	const cfg = params.cfg;
	const globalFs = cfg?.tools?.fs;
	return { workspaceOnly: (cfg && params.agentId ? resolveAgentConfig(cfg, params.agentId)?.tools?.fs : void 0)?.workspaceOnly ?? globalFs?.workspaceOnly };
}
/**
* Derive the filesystem policy for callers that build OpenClaw tools without one.
* Mirrors the embedded runner: a session permission mode decides when present,
* otherwise `tools.fs.workspaceOnly`. Returns undefined when unrestricted so
* callers keep their unrestricted behavior; a restricted run can never be
* mistaken for an unrestricted one by omission.
*/
function resolveOpenClawToolsFsPolicy(params) {
	if (!(params.sessionPermissionPolicy ? resolveSessionPermissionCoreToolPolicy(params.sessionPermissionPolicy).workspaceOnly : resolveEffectiveToolFsWorkspaceOnly(params))) return;
	return {
		workspaceOnly: true,
		...params.sessionPermissionPolicy ? { root: params.sessionPermissionPolicy.root } : {},
		...params.attachmentReadRoot ? { readOnlyRoots: [params.attachmentReadRoot] } : {}
	};
}
function resolveEffectiveToolFsWorkspaceOnly(params) {
	return resolveToolFsConfig(params).workspaceOnly === true;
}
function resolveEffectiveToolFsRootExpansionAllowed(params) {
	if ((params.workspaceOnly ?? resolveToolFsConfig(params).workspaceOnly) === true) return false;
	const cfg = params.cfg;
	if (!cfg) return true;
	const agentTools = params.agentId ? resolveAgentConfig(cfg, params.agentId)?.tools : void 0;
	const globalTools = cfg.tools;
	const profile = agentTools?.profile ?? globalTools?.profile;
	const profileAlsoAllow = new Set(agentTools?.alsoAllow ?? globalTools?.alsoAllow ?? []);
	const profilePolicy = mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(profile), profileAlsoAllow.size > 0 ? Array.from(profileAlsoAllow) : void 0);
	const globalPolicy = pickSandboxToolPolicy(globalTools);
	const agentPolicy = pickSandboxToolPolicy(agentTools);
	return isToolAllowedByPolicies("read", [
		profilePolicy,
		globalPolicy,
		agentPolicy
	]);
}
//#endregion
export { resolveToolFsConfig as a, resolveStoredSessionPermissionPolicy as i, resolveEffectiveToolFsWorkspaceOnly as n, resolveOpenClawToolsFsPolicy as r, resolveEffectiveToolFsRootExpansionAllowed as t };
