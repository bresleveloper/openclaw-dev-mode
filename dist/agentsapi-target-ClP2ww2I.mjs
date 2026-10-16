//#region extensions/agentsapi/agentsapi-target.ts
function requireAgentsApiSessionTarget(params) {
	const target = params.sessionTarget;
	if (!target?.agentId || !target.sessionId || !target.sessionKey || !target.storePath || target.sessionId !== params.sessionId || target.agentId !== params.agentId || target.sessionKey !== params.sessionKey) throw new Error("Agents API requires a matching host-prepared session target");
	return {
		...target,
		agentId: target.agentId,
		sessionId: target.sessionId,
		sessionKey: target.sessionKey,
		storePath: target.storePath
	};
}
//#endregion
export { requireAgentsApiSessionTarget as t };
