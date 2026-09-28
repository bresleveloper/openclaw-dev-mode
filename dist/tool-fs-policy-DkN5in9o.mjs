import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { d as resolveToolProfilePolicy } from "./tool-policy-shared-auQCQEhM.mjs";
import { o as isToolAllowedByPolicies } from "./tool-policy-match-Bv2XOvEF.mjs";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-Dp4rlIlG.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-YDdaK0oX.mjs";
import "./agent-scope-CTuYDtny.mjs";
import "./session-permission-exec-mode-Bn0mEuts.mjs";
//#region src/agents/tool-fs-policy.ts
function resolveToolFsConfig(params) {
	const cfg = params.cfg;
	const globalFs = cfg?.tools?.fs;
	return { workspaceOnly: (cfg && params.agentId ? resolveAgentConfig(cfg, params.agentId)?.tools?.fs : void 0)?.workspaceOnly ?? globalFs?.workspaceOnly };
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
	const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), profileAlsoAllow.size > 0 ? Array.from(profileAlsoAllow) : void 0);
	const globalPolicy = pickSandboxToolPolicy(globalTools);
	const agentPolicy = pickSandboxToolPolicy(agentTools);
	return isToolAllowedByPolicies("read", [
		profilePolicy,
		globalPolicy,
		agentPolicy
	]);
}
//#endregion
export { resolveEffectiveToolFsWorkspaceOnly as n, resolveToolFsConfig as r, resolveEffectiveToolFsRootExpansionAllowed as t };
