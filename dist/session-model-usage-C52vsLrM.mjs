//#region src/agents/sessions/agent-session-types.ts
/** The embedded request boundary owns threshold checks while this flag is set. */
const agentSessionDeferThresholdCompaction = Symbol("openclaw.agent-session.defer-threshold-compaction");
/** Runs provider checkpoint work without aborting or restarting the current tool loop. */
const agentSessionRunProviderCompaction = Symbol("openclaw.agent-session.run-provider-compaction");
//#endregion
//#region src/agents/agent-hooks/session-manager-runtime-registry.ts
/** Creates a WeakMap-backed runtime registry keyed by SessionManager object identity. */
function createSessionManagerRuntimeRegistry() {
	const registry = /* @__PURE__ */ new WeakMap();
	return {
		set: (sessionManager, value) => {
			if (!sessionManager || typeof sessionManager !== "object") return;
			if (value === null) registry.delete(sessionManager);
			else registry.set(sessionManager, value);
		},
		get: (sessionManager) => {
			return sessionManager && typeof sessionManager === "object" ? registry.get(sessionManager) ?? null : null;
		}
	};
}
//#endregion
//#region src/agents/sessions/session-model-usage.ts
const sinkBySessionManager = createSessionManagerRuntimeRegistry();
/** Records one auxiliary model completion at the session that owns the request. */
function recordSessionModelUsage(sessionManager, usage) {
	sinkBySessionManager.get(sessionManager)?.(usage);
}
/** Sets the active accounting owner for auxiliary model usage. */
function setSessionModelUsageSink(sessionManager, sink) {
	sinkBySessionManager.set(sessionManager, sink);
}
//#endregion
export { agentSessionRunProviderCompaction as a, agentSessionDeferThresholdCompaction as i, setSessionModelUsageSink as n, createSessionManagerRuntimeRegistry as r, recordSessionModelUsage as t };
