//#region src/agents/agent-bundle-mcp-runtime-shared.ts
const SESSION_MCP_RUNTIME_MANAGER_KEY = Symbol.for("openclaw.sessionMcpRuntimeManager");
const SESSION_MCP_RUNTIME_SWEEP_INTERVAL_MS = 6e4;
/** Idle eviction is opt-in; zero retains the session lifetime. */
function resolveSessionMcpRuntimeIdleTtlMs(cfg) {
	const raw = cfg?.mcp?.sessionIdleTtlMs;
	return typeof raw === "number" && Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : 0;
}
/** Checks whether harness-scoped MCP can affect a turn without loading its runtime graph. */
function shouldLoadRequesterScopedMcpHarnessRuntime(params) {
	if (params.requesterSenderId?.trim()) return true;
	return (globalThis[SESSION_MCP_RUNTIME_MANAGER_KEY]?.getAdvertisedScopedCatalog(params.sessionId)?.tools.length ?? 0) > 0;
}
//#endregion
export { shouldLoadRequesterScopedMcpHarnessRuntime as i, SESSION_MCP_RUNTIME_SWEEP_INTERVAL_MS as n, resolveSessionMcpRuntimeIdleTtlMs as r, SESSION_MCP_RUNTIME_MANAGER_KEY as t };
