import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { D as resolveProjectedAgentRunProgressState, t as buildProjectedAgentRunIndex } from "./agent-run-registry-gmaPgO-n.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { c as isSwarmRunWaitingForCapacity } from "./swarm-scheduler-CocpuN_N.mjs";
import { E as getSubagentRunRuntimeKey } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { s as getSubagentRunsForChildSession } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { a as isSubagentRunLive, o as isSubagentRunQueued } from "./subagent-run-liveness-DPrFEcUI.mjs";
import { c as listActiveSubagentSessionKeys, i as getLatestLiveSubagentRunByChildSessionKey } from "./subagent-registry-read-DY0g8fGW.mjs";
import { r as resolveChatRunOwnerAgentId, t as chatRunBelongsToAgent } from "./chat-run-owner-BB6L4tWc.mjs";
import { n as isEmbeddedAgentRunActive, r as listActiveEmbeddedRunSessionIds } from "./active-run-projections-Crpg2l0z.mjs";
import { D as resolveEmbeddedAgentSessionProgressState } from "./runs-Czr-I6_B.mjs";
import { t as isAgentRunWaitingForCapacity } from "./agent-run-capacity-wait-DbnNjNgr.mjs";
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
	return chatRunBelongsToAgent({
		agentId: active.agentId,
		sessionKey: active.sessionKey,
		defaultAgentId
	}, requestedAgentId);
}
function hasRegisteredChatRunForSessionKey(params) {
	const controllers = params.context.chatAbortControllers;
	return controllers instanceof Map && [...controllers.values()].some((active) => isTrackedActiveSessionRunForKey(active, params.sessionKey, params.agentId, params.defaultAgentId));
}
function hasTrackedActiveSessionRun(params) {
	const activeRuns = collectTrackedActiveSessionRuns(params.context);
	const sessionKeys = [params.canonicalKey, params.requestedKey];
	return activeRuns.some((active) => sessionKeys.some((key) => isTrackedActiveSessionRunForKey(active, key, params.agentId, params.defaultAgentId)));
}
function resolveVisibleActiveSessionRunState(params) {
	const sessionId = params.sessionId?.trim();
	const resolvedAgentId = params.agentId ?? parseAgentSessionKey(params.canonicalKey)?.agentId ?? parseAgentSessionKey(params.requestedKey)?.agentId;
	const sessionKeys = [params.canonicalKey, params.requestedKey];
	const sessionIdOwner = resolvedAgentId ?? params.defaultAgentId;
	const matchesRequestedSession = (active) => sessionKeys.some((key) => isTrackedActiveSessionRunForKey(active, key, resolvedAgentId, params.defaultAgentId)) || sessionId !== void 0 && active.sessionId === sessionId && sessionIdOwner !== void 0 && sessionIdOwner !== "" && chatRunBelongsToAgent({
		agentId: active.agentId,
		sessionKey: active.sessionKey,
		defaultAgentId: params.defaultAgentId
	}, sessionIdOwner);
	const matchingTrackedRuns = (params.trackedActiveRuns ?? collectTrackedActiveSessionRuns(params.context, params.includeTerminalPersistence, {
		requestedKey: params.requestedKey,
		canonicalKey: params.canonicalKey,
		sessionId
	})).filter(matchesRequestedSession);
	const hasTerminalPersistence = matchingTrackedRuns.some((active) => active.terminalPersistence);
	const runIds = matchingTrackedRuns.filter((active) => !active.terminalPersistence).map((active) => active.runId);
	const directSubagent = getLatestLiveSubagentRunByChildSessionKey(params.canonicalKey, void 0, resolvedAgentId);
	const matchesDirectSubagentSession = Boolean(directSubagent && isTrackedActiveSessionRunForKey({ sessionKey: directSubagent.childSessionKey }, params.canonicalKey, resolvedAgentId, params.defaultAgentId));
	const hasLiveSubagent = matchesDirectSubagentSession && isSubagentRunLive(directSubagent);
	const hasQueuedSubagent = matchesDirectSubagentSession && isSubagentRunQueued(directSubagent);
	if ((hasLiveSubagent || hasQueuedSubagent) && directSubagent && !runIds.includes(directSubagent.runId)) runIds.push(directSubagent.runId);
	const subagentCapacityWait = (hasLiveSubagent || hasQueuedSubagent) && directSubagent && (isAgentRunWaitingForCapacity(directSubagent.runId) || isSwarmRunWaitingForCapacity(directSubagent.schedulerSlotId ?? directSubagent.runId, getSubagentRunRuntimeKey(directSubagent)));
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
	const candidateKeys = new Set(projectedAgentRunIndex.ownerlessSessionKeys.keys());
	const candidateIds = /* @__PURE__ */ new Set([...projectedAgentRunIndex.ownerlessSessionIds.keys(), ...listActiveEmbeddedRunSessionIds()]);
	for (const [source, candidates] of [[projectedAgentRunIndex.sessionKeys, candidateKeys], [projectedAgentRunIndex.sessionIds, candidateIds]]) for (const identity of source.keys()) candidates.add(identity.slice(identity.indexOf("\0") + 1));
	for (const run of collectTrackedActiveSessionRuns(context)) for (const [index, key] of [[byKey, run.sessionKey], [byId, run.sessionId]]) if (key) {
		const entries = index.get(key) ?? [];
		entries.push(run);
		index.set(key, entries);
	}
	const project = (params) => {
		const sessionId = params.sessionId?.trim() ?? "";
		if (!byKey.has(params.canonicalKey) && !byKey.has(params.requestedKey) && !byId.has(sessionId) && !candidateKeys.has(params.canonicalKey) && !candidateKeys.has(params.requestedKey) && !candidateIds.has(sessionId) && (!sessionId || !isEmbeddedAgentRunActive(sessionId)) && getSubagentRunsForChildSession(params.canonicalKey.trim())[Symbol.iterator]().next().done) return {
			active: false,
			runIds: []
		};
		return resolveVisibleActiveSessionRunState({
			...params,
			context,
			projectedAgentRunIndex,
			trackedActiveRuns: [.../* @__PURE__ */ new Set([
				...byKey.get(params.canonicalKey) ?? [],
				...byKey.get(params.requestedKey) ?? [],
				...byId.get(sessionId) ?? []
			])]
		});
	};
	const candidateSessionIdsOrKeys = () => new Set([
		...candidateKeys,
		...candidateIds,
		...byKey.keys(),
		...byId.keys(),
		...listActiveSubagentSessionKeys()
	].filter((identity) => identity.length > 0));
	return Object.assign(project, { candidateSessionIdsOrKeys });
}
//#endregion
export { resolveVisibleActiveSessionRunState as i, hasRegisteredChatRunForSessionKey as n, hasTrackedActiveSessionRun as r, createVisibleActiveSessionRunProjector as t };
