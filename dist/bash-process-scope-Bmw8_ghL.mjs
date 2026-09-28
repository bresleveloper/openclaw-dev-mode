//#region src/agents/bash-process-scope.ts
/** Resolve the process-tool isolation key for exec/process session state. */
function resolveProcessToolScopeKey(params) {
	const explicitScopeKey = params.scopeKey?.trim();
	if (explicitScopeKey) return explicitScopeKey;
	const sessionKey = params.sessionKey?.trim();
	if (sessionKey) return sessionKey;
	const sessionId = params.sessionId?.trim();
	if (sessionId) return sessionId;
	const agentId = params.agentId?.trim();
	return agentId ? `agent:${agentId}` : void 0;
}
//#endregion
export { resolveProcessToolScopeKey as t };
