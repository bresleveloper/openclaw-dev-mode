import { n as isImplicitAcpWorkspaceCandidate, u as resolveAgentWorkspaceProvisioning } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as resolveAcpSessionCwd } from "./session-identifiers-dXNk5MtW.mjs";
//#region src/agents/acp-workspace-provisioning.ts
/**
* Turn-level ACP workspace provisioning resolution (#92015).
*
* Resolves the provisioning mode for one concrete invocation by using the
* invocation's own cwd — the live session's ACP meta cwd first, then the
* configured ACP binding that owns the session key — instead of an agent-wide
* binding scan, so mixed-binding agents and workspace-equal cwds keep standard
* bootstrap behavior.
*/
async function resolveAcpAgentWorkspaceProvisioningForTurn(params) {
	if (!isImplicitAcpWorkspaceCandidate(params.cfg, params.agentId)) return "standard";
	const invocation = params.workspaceDir ? { workspaceDir: params.workspaceDir } : void 0;
	if (params.cwd) return resolveAgentWorkspaceProvisioning(params.cfg, params.agentId, {
		...invocation,
		cwd: params.cwd
	});
	const metaCwd = resolveAcpSessionCwd(params.sessionEntry?.acp);
	if (metaCwd) return resolveAgentWorkspaceProvisioning(params.cfg, params.agentId, {
		...invocation,
		cwd: metaCwd
	});
	if (params.sessionKey) {
		const { resolveConfiguredAcpBindingSpecBySessionKey } = await import("./persistent-bindings.resolve-BlEe6yZT.mjs");
		const bindingCwd = resolveConfiguredAcpBindingSpecBySessionKey({
			cfg: params.cfg,
			sessionKey: params.sessionKey
		})?.cwd;
		if (bindingCwd) return resolveAgentWorkspaceProvisioning(params.cfg, params.agentId, {
			...invocation,
			cwd: bindingCwd
		});
	}
	return resolveAgentWorkspaceProvisioning(params.cfg, params.agentId, invocation);
}
//#endregion
export { resolveAcpAgentWorkspaceProvisioningForTurn };
