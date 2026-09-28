import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as buildProjectedAgentRunIndex, w as resolveProjectedAgentRunProgressState } from "./agent-run-registry-DO6Dg2r0.mjs";
import { a as isSubagentRunLive, o as isSubagentRunQueued, x as isSwarmRunWaitingForCapacity } from "./subagent-run-liveness-9vTRtoqd.mjs";
import { a as getLatestLiveSubagentRunByChildSessionKey } from "./subagent-registry-read-C2SIiLpb.mjs";
import { O as resolveEmbeddedAgentSessionProgressState } from "./runs-ciDkXIOQ.mjs";
import { r as resolveChatRunOwnerAgentId } from "./chat-run-owner-HbcABEVb.mjs";
import { t as isAgentRunWaitingForCapacity } from "./agent-run-capacity-wait-CbVGA6gD.mjs";
//#region src/gateway/server-methods/session-active-runs.ts
function collectTrackedActiveSessionRuns(context, includeTerminalPersistence = false, selection) {
	const runs = [];
	if (!(context.chatAbortControllers instanceof Map)) return runs;
	for (const [runId, active] of context.chatAbortControllers) {
		const terminalPersistence = includeTerminalPersistence && active.projectSessionActive === false && active.projectSessionTerminalPending === true;
		if ((active.projectSessionActive !== false || terminalPersistence) && active.controlUiVisible !== false) {
			const sessionKey = active.sessionKey?.trim();
			const sessionId = active.sessionId?.trim();
			if (!sessionKey && !sessionId) continue;
			if (selection && sessionKey !== selection.requestedKey && sessionKey !== selection.canonicalKey && (selection.sessionId === void 0 || sessionId !== selection.sessionId)) continue;
			runs.push({
				runId,
				...sessionKey ? { sessionKey } : {},
				...sessionId ? { sessionId } : {},
				agentId: typeof active.agentId === "string" ? normalizeAgentId(active.agentId) : void 0,
				...terminalPersistence ? { terminalPersistence: true } : {}
			});
		}
	}
	return runs;
}
function isTrackedActiveSessionRunForKey(active, key, agentId, defaultAgentId) {
	if (!active.sessionKey || active.sessionKey !== key) return false;
	const requestedAgentId = resolveChatRunOwnerAgentId({
		agentId,
		sessionKey: key,
		defaultAgentId
	});
	if (!requestedAgentId) return false;
	const activeAgentId = resolveChatRunOwnerAgentId({
		agentId: active.agentId,
		sessionKey: active.sessionKey,
		defaultAgentId
	});
	return activeAgentId ? normalizeAgentId(activeAgentId) === normalizeAgentId(requestedAgentId) : false;
}
function isTrackedActiveSessionRunForSessionId(active, sessionId, agentId, defaultAgentId) {
	if (active.sessionId !== sessionId) return false;
	const requestedAgentId = agentId ?? defaultAgentId;
	if (!requestedAgentId) return false;
	return resolveChatRunOwnerAgentId({
		agentId: active.agentId,
		sessionKey: active.sessionKey,
		defaultAgentId
	}) === normalizeAgentId(requestedAgentId);
}
function hasRegisteredChatRunForSessionKey(params) {
	const controllers = params.context.chatAbortControllers;
	return controllers instanceof Map && [...controllers.values()].some((active) => isTrackedActiveSessionRunForKey(active, params.sessionKey, params.agentId, params.defaultAgentId));
}
/** Returns true when either requested or canonical session key has a visible active run. */
function hasTrackedActiveSessionRun(params) {
	return collectTrackedActiveSessionRuns(params.context).some((active) => !params.excludeRunIds?.has(active.runId) && (isTrackedActiveSessionRunForKey(active, params.canonicalKey, params.agentId, params.defaultAgentId) || isTrackedActiveSessionRunForKey(active, params.requestedKey, params.agentId, params.defaultAgentId)));
}
function resolveVisibleActiveSessionRunState(params) {
	const sessionId = params.sessionId?.trim();
	const resolvedAgentId = params.agentId ?? parseAgentSessionKey(params.canonicalKey)?.agentId ?? parseAgentSessionKey(params.requestedKey)?.agentId;
	const matchesRequestedSession = (active) => isTrackedActiveSessionRunForKey(active, params.canonicalKey, resolvedAgentId, params.defaultAgentId) || isTrackedActiveSessionRunForKey(active, params.requestedKey, resolvedAgentId, params.defaultAgentId) || sessionId !== void 0 && isTrackedActiveSessionRunForSessionId(active, sessionId, resolvedAgentId, params.defaultAgentId);
	const matchingTrackedRuns = (params.trackedActiveRuns ?? collectTrackedActiveSessionRuns(params.context, params.includeTerminalPersistence, {
		requestedKey: params.requestedKey,
		canonicalKey: params.canonicalKey,
		sessionId
	})).filter(matchesRequestedSession);
	const hasTerminalPersistence = matchingTrackedRuns.some((active) => active.terminalPersistence);
	const runIds = matchingTrackedRuns.filter((active) => !active.terminalPersistence).map((active) => active.runId);
	const directSubagent = getLatestLiveSubagentRunByChildSessionKey(params.canonicalKey);
	const matchesDirectSubagentSession = Boolean(directSubagent && isTrackedActiveSessionRunForKey({ sessionKey: directSubagent.childSessionKey }, params.canonicalKey, resolvedAgentId, params.defaultAgentId));
	const hasLiveSubagent = matchesDirectSubagentSession && isSubagentRunLive(directSubagent);
	const hasQueuedSubagent = matchesDirectSubagentSession && isSubagentRunQueued(directSubagent);
	if ((hasLiveSubagent || hasQueuedSubagent) && directSubagent && !runIds.includes(directSubagent.runId)) runIds.push(directSubagent.runId);
	const subagentCapacityWait = (hasLiveSubagent || hasQueuedSubagent) && directSubagent && (isAgentRunWaitingForCapacity(directSubagent.runId) || isSwarmRunWaitingForCapacity(directSubagent.schedulerSlotId ?? directSubagent.runId, directSubagent));
	const projectedRunState = resolveProjectedAgentRunProgressState({
		sessionKeys: [params.requestedKey, params.canonicalKey],
		...sessionId ? { sessionId } : {},
		...resolvedAgentId ? { agentId: resolvedAgentId } : {},
		...params.defaultAgentId ? { defaultAgentId: params.defaultAgentId } : {},
		...params.projectedAgentRunIndex ? { index: params.projectedAgentRunIndex } : {}
	});
	const embeddedRunState = sessionId === void 0 ? void 0 : resolveEmbeddedAgentSessionProgressState(sessionId, {
		agentId: resolvedAgentId,
		defaultAgentId: params.defaultAgentId
	});
	const running = (hasLiveSubagent || hasQueuedSubagent) && !subagentCapacityWait || matchingTrackedRuns.some((active) => !isAgentRunWaitingForCapacity(active.runId)) || projectedRunState === "running" || embeddedRunState === "running";
	const active = running || hasTerminalPersistence || runIds.length > 0 || embeddedRunState === "queued" || projectedRunState === "queued";
	return {
		active,
		...projectedRunState !== "running" && projectedRunState !== "queued" && embeddedRunState === void 0 && !hasTerminalPersistence ? { runIds: runIds.toSorted() } : {},
		...active && !running && (subagentCapacityWait || projectedRunState === "queued" || projectedRunState === "capacity-wait") ? { status: "queued" } : {}
	};
}
/** Request-scoped index; candidate selection must not rescan all controllers per row. */
function createVisibleActiveSessionRunProjector(context, projectedAgentRunIndex = buildProjectedAgentRunIndex()) {
	const byKey = /* @__PURE__ */ new Map();
	const byId = /* @__PURE__ */ new Map();
	for (const run of collectTrackedActiveSessionRuns(context)) for (const [index, key] of [[byKey, run.sessionKey], [byId, run.sessionId]]) if (key) {
		const entries = index.get(key) ?? [];
		entries.push(run);
		index.set(key, entries);
	}
	return (params) => resolveVisibleActiveSessionRunState({
		...params,
		context,
		projectedAgentRunIndex,
		trackedActiveRuns: [.../* @__PURE__ */ new Set([
			...byKey.get(params.canonicalKey) ?? [],
			...byKey.get(params.requestedKey) ?? [],
			...byId.get(params.sessionId?.trim() ?? "") ?? []
		])]
	});
}
//#endregion
export { resolveVisibleActiveSessionRunState as i, hasRegisteredChatRunForSessionKey as n, hasTrackedActiveSessionRun as r, createVisibleActiveSessionRunProjector as t };
