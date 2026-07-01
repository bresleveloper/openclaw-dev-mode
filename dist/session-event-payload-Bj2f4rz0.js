import { u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
//#region src/gateway/server-methods/session-active-runs.ts
function collectTrackedActiveSessionRuns(context) {
	const runs = [];
	if (!(context.chatAbortControllers instanceof Map)) return runs;
	for (const active of context.chatAbortControllers.values()) if (active.projectSessionActive !== false && active.controlUiVisible !== false && typeof active.sessionKey === "string" && active.sessionKey.trim()) runs.push({
		sessionKey: active.sessionKey,
		agentId: typeof active.agentId === "string" ? normalizeAgentId(active.agentId) : void 0
	});
	return runs;
}
function isTrackedActiveSessionRunForKey(active, key, agentId, defaultAgentId) {
	if (active.sessionKey !== key) return false;
	if (key !== "global") return true;
	const requestedAgentId = agentId ?? defaultAgentId;
	if (!requestedAgentId) return true;
	const activeAgentId = active.agentId ?? defaultAgentId;
	return activeAgentId ? normalizeAgentId(activeAgentId) === normalizeAgentId(requestedAgentId) : false;
}
/** Returns true when either requested or canonical session key has a visible active run. */
function hasTrackedActiveSessionRun(params) {
	return collectTrackedActiveSessionRuns(params.context).some((active) => isTrackedActiveSessionRunForKey(active, params.canonicalKey, params.agentId, params.defaultAgentId) || isTrackedActiveSessionRunForKey(active, params.requestedKey, params.agentId, params.defaultAgentId));
}
//#endregion
//#region src/gateway/session-event-payload.ts
function buildGatewaySessionEventFields(params) {
	const { sessionRow } = params;
	const omitUnscopedGlobalGoal = sessionRow.key === "global" && !params.agentId;
	return {
		updatedAt: sessionRow.updatedAt ?? void 0,
		sessionId: sessionRow.sessionId,
		kind: sessionRow.kind,
		channel: sessionRow.channel,
		subject: sessionRow.subject,
		groupChannel: sessionRow.groupChannel,
		space: sessionRow.space,
		chatType: sessionRow.chatType,
		origin: sessionRow.origin,
		spawnedBy: sessionRow.spawnedBy,
		spawnedWorkspaceDir: sessionRow.spawnedWorkspaceDir,
		spawnedCwd: sessionRow.spawnedCwd,
		forkedFromParent: sessionRow.forkedFromParent,
		spawnDepth: sessionRow.spawnDepth,
		subagentRole: sessionRow.subagentRole,
		subagentControlScope: sessionRow.subagentControlScope,
		label: params.label ?? sessionRow.label,
		displayName: params.displayName ?? sessionRow.displayName,
		deliveryContext: sessionRow.deliveryContext,
		parentSessionKey: params.parentSessionKey ?? sessionRow.parentSessionKey,
		childSessions: sessionRow.childSessions,
		thinkingLevel: sessionRow.thinkingLevel,
		fastMode: sessionRow.fastMode,
		verboseLevel: sessionRow.verboseLevel,
		reasoningLevel: sessionRow.reasoningLevel,
		elevatedLevel: sessionRow.elevatedLevel,
		sendPolicy: sessionRow.sendPolicy,
		systemSent: sessionRow.systemSent,
		abortedLastRun: sessionRow.abortedLastRun,
		inputTokens: sessionRow.inputTokens,
		outputTokens: sessionRow.outputTokens,
		lastChannel: sessionRow.lastChannel,
		lastTo: sessionRow.lastTo,
		lastAccountId: sessionRow.lastAccountId,
		lastThreadId: sessionRow.lastThreadId,
		totalTokens: sessionRow.totalTokens,
		totalTokensFresh: sessionRow.totalTokensFresh,
		...omitUnscopedGlobalGoal ? {} : { goal: sessionRow.goal ?? null },
		contextTokens: sessionRow.contextTokens,
		estimatedCostUsd: sessionRow.estimatedCostUsd,
		responseUsage: sessionRow.responseUsage,
		modelProvider: sessionRow.modelProvider,
		model: sessionRow.model,
		status: sessionRow.status,
		...params.hasActiveRun === void 0 ? {} : { hasActiveRun: params.hasActiveRun },
		startedAt: sessionRow.startedAt,
		endedAt: sessionRow.endedAt,
		runtimeMs: sessionRow.runtimeMs,
		compactionCheckpointCount: sessionRow.compactionCheckpointCount,
		latestCompactionCheckpoint: sessionRow.latestCompactionCheckpoint
	};
}
//#endregion
export { hasTrackedActiveSessionRun as n, buildGatewaySessionEventFields as t };
