import { n as withPreparedExecDefaults, t as withPreparedToolConstruction } from "./tool-construction-preparation-Bc08WuI0.mjs";
//#region src/agents/embedded-agent-runner/sandbox-info.ts
/** Computes whether elevated exec can provide full host access for an embedded turn. */
function resolveEmbeddedFullAccessState(params) {
	const blockedByPolicy = params.execPolicy?.mode !== void 0 && params.execPolicy.mode !== "full" || params.execPolicy?.security !== void 0 && params.execPolicy.security !== "full" || params.execPolicy?.ask === "always" || params.hostPolicy?.security !== void 0 && params.hostPolicy.security !== "full" || params.hostPolicy?.ask === "always";
	const available = !blockedByPolicy && (params.execElevated?.fullAccessAvailable ?? Boolean(params.execElevated?.enabled && params.execElevated.allowed));
	return available ? { available } : {
		available,
		blockedReason: !blockedByPolicy && params.execElevated?.fullAccessAvailable === false ? params.execElevated.fullAccessBlockedReason ?? "host-policy" : "host-policy"
	};
}
async function resolveEmbeddedSandboxInfoExecPolicy(params, source) {
	return withPreparedToolConstruction(params.config, source, async (shared) => withPreparedExecDefaults({
		cfg: shared.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionEntry: params.permissionMode ? { permissionMode: params.permissionMode } : void 0,
		sandboxAvailable: params.sandboxAvailable,
		elevatedRequested: true,
		execOverrides: params.execOverrides
	}, shared, async (defaults) => ({
		mode: defaults.mode,
		security: defaults.security,
		ask: defaults.ask
	})));
}
function buildEmbeddedSandboxInfo(sandbox, execElevated, execPolicy, hostPolicy) {
	if (!sandbox?.enabled) return;
	const elevatedConfigured = execElevated?.enabled === true;
	const elevatedAllowed = !sandbox.required && Boolean(execElevated?.enabled && execElevated.allowed);
	const fullAccess = sandbox.required ? {
		available: false,
		blockedReason: "host-policy"
	} : resolveEmbeddedFullAccessState({
		execElevated,
		execPolicy,
		hostPolicy
	});
	return {
		enabled: true,
		workspaceDir: sandbox.workspaceDir,
		containerWorkspaceDir: sandbox.containerWorkdir,
		workspaceAccess: sandbox.workspaceAccess,
		agentWorkspaceMount: sandbox.workspaceAccess === "ro" ? "/agent" : void 0,
		browserBridgeUrl: sandbox.browser?.bridgeUrl,
		hostBrowserAllowed: sandbox.browserAllowHostControl,
		...elevatedConfigured ? { elevated: {
			allowed: elevatedAllowed,
			defaultLevel: sandbox.required ? "off" : execElevated?.defaultLevel ?? "off",
			fullAccessAvailable: fullAccess.available,
			...fullAccess.blockedReason ? { fullAccessBlockedReason: fullAccess.blockedReason } : {}
		} } : {}
	};
}
//#endregion
export { resolveEmbeddedFullAccessState as n, resolveEmbeddedSandboxInfoExecPolicy as r, buildEmbeddedSandboxInfo as t };
