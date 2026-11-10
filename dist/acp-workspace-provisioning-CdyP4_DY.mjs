import { n as isImplicitAcpWorkspaceCandidate, p as resolveAgentWorkspaceProvisioning } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as resolveAcpSessionCwd } from "./session-identifiers-2CkhpQUq.mjs";
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
	let cwd = params.cwd || resolveAcpSessionCwd(params.sessionEntry?.acp);
	if (!cwd && params.sessionKey) {
		const { resolveConfiguredAcpBindingSpecBySessionKey } = await import("./persistent-bindings.resolve-DkbwVaKw.mjs");
		cwd = resolveConfiguredAcpBindingSpecBySessionKey({
			cfg: params.cfg,
			sessionKey: params.sessionKey
		})?.cwd;
	}
	return resolveAgentWorkspaceProvisioning(params.cfg, params.agentId, cwd ? {
		...invocation,
		cwd
	} : invocation);
}
//#endregion
export { resolveAcpAgentWorkspaceProvisioningForTurn };
