//#region src/agents/bash-process-scope.ts
/** Resolve the process-tool isolation key for exec/process session state. */
function resolveProcessToolScopeKey(params) {
	const scopeKey = params.scopeKey?.trim() || params.sessionKey?.trim() || params.sessionId?.trim();
	if (scopeKey) return scopeKey;
	const agentId = params.agentId?.trim();
	return agentId ? `agent:${agentId}` : void 0;
}
//#endregion
export { resolveProcessToolScopeKey as t };
