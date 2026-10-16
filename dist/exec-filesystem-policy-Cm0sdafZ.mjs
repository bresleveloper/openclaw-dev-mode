import "./agent-scope-config-CDYpzA0r.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { o as isToolAllowedByPolicies } from "./tool-policy-match-Dn8gpf-E.mjs";
import { t as resolveConfiguredToolPolicies } from "./agent-tools.policy-Ni4Rljqy.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-DGIfx80_.mjs";
//#region src/security/exec-filesystem-policy.ts
const MUTATING_FS_TOOLS = [
	"write",
	"edit",
	"apply_patch"
];
const RUNTIME_TOOLS = ["exec", "process"];
function isExecFilesystemConstrained(params) {
	return params.sandboxMode === "all" && params.execHost !== "gateway" && params.execHost !== "node" && params.sandboxWorkspaceAccess !== "rw";
}
/** Find policy scopes where exec can still mutate files despite disabled fs tools. */
function collectExecFilesystemPolicyDriftHits(cfg) {
	const hits = [];
	const globalExec = cfg.tools?.exec;
	const contexts = [{ scopeLabel: "tools" }];
	for (const agent of listAgentEntries(cfg)) {
		if (!agent || typeof agent !== "object" || typeof agent.id !== "string") continue;
		contexts.push({
			scopeLabel: `agents.entries.${agent.id}.tools`,
			agentId: agent.id,
			tools: agent.tools
		});
	}
	for (const context of contexts) {
		const sandbox = resolveSandboxConfigForAgent(cfg, context.agentId);
		const execHost = context.tools?.exec?.host ?? globalExec?.host ?? "auto";
		if (isExecFilesystemConstrained({
			sandboxMode: sandbox.mode,
			sandboxWorkspaceAccess: sandbox.workspaceAccess,
			execHost
		})) continue;
		const policies = resolveConfiguredToolPolicies({
			cfg,
			agentTools: context.tools,
			sandboxMode: sandbox.mode,
			agentId: context.agentId
		});
		const runtimeTools = RUNTIME_TOOLS.filter((tool) => isToolAllowedByPolicies(tool, policies));
		if (!runtimeTools.includes("exec")) continue;
		const disabledFilesystemTools = MUTATING_FS_TOOLS.filter((tool) => !isToolAllowedByPolicies(tool, policies));
		if (disabledFilesystemTools.length !== MUTATING_FS_TOOLS.length) continue;
		hits.push({
			scopeLabel: context.scopeLabel,
			runtimeTools,
			disabledFilesystemTools,
			sandboxMode: sandbox.mode,
			sandboxWorkspaceAccess: sandbox.workspaceAccess,
			execHost
		});
	}
	return hits;
}
//#endregion
export { collectExecFilesystemPolicyDriftHits as t };
