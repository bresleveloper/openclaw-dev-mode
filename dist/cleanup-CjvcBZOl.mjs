import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey, r as agentSessionKeysMatchByRequestKey } from "./session-key-CSDERtm3.mjs";
import { j as removeQueuedItemsByRef, m as completeFollowupRuns, n as FOLLOWUP_QUEUES, o as followupQueueSources } from "./state-DNPW_vEt.mjs";
import { f as prepareCommandLaneClear, n as clearCommandLane, r as countQueuedCommandsInLane } from "./command-queue-Dvag6gVL.mjs";
import { s as consumeQueueSummaryDelivery, t as clearFollowupDrainCallback } from "./drain-BQdEu_Zr.mjs";
import { n as resolveSessionLane } from "./lanes-DQO4OUmF.mjs";
//#region src/auto-reply/reply/queue/cleanup.ts
function matchesSessionQueueTarget(source, params) {
	const agentId = normalizeAgentId(params.agentId);
	const keyAgentId = parseAgentSessionKey(source.sessionKey)?.agentId;
	return normalizeOptionalString(source.agentId) !== void 0 && normalizeAgentId(source.agentId) === agentId && (!keyAgentId || normalizeAgentId(keyAgentId) === agentId) && (source.sessionKey === params.sessionKey || params.sessionKeyAliases?.some((key) => agentSessionKeysMatchByRequestKey(source.sessionKey, key)) === true) && (params.sessionId === void 0 || source.sessionId === params.sessionId);
}
function matchesSessionFollowupRun(source, params) {
	return matchesSessionQueueTarget(source.run, params) && (params.sessionId === void 0 || source.admissionSessionId === void 0 || source.admissionSessionId === params.sessionId);
}
function resolveSessionLifecycleQueueKeys(params) {
	const agentId = normalizeAgentId(params.agentId);
	const keys = [...new Set([
		...params.keys,
		params.sessionKey,
		params.sessionId
	].map(normalizeOptionalString).filter((key) => key !== void 0).filter((key) => {
		const keyAgentId = parseAgentSessionKey(key)?.agentId;
		return !keyAgentId || normalizeAgentId(keyAgentId) === agentId;
	}))];
	return {
		keys,
		sessionKeyAliases: keys.filter((key) => key !== params.sessionId),
		matchesLaneEntry: (key) => (target) => target ? matchesSessionQueueTarget(target, {
			...params,
			sessionKeyAliases: keys
		}) : key === params.sessionId || parseAgentSessionKey(key) !== null
	};
}
/** Capture pending sources before Stop callbacks can replace their queue or session. */
function prepareSessionFollowupCleanup(params) {
	const captures = [...new Set(params.keys.map((key) => normalizeOptionalString(key)).filter((key) => key !== void 0))].flatMap((key) => {
		const queue = FOLLOWUP_QUEUES.get(key);
		if (!queue) return [];
		const isPending = (source) => source.steerPending?.phase !== "injecting" && !queue.inFlight.has(source) && !queue.activeSummarySources.has(source);
		return [{
			key,
			queue,
			isPending,
			sources: [...new Set(followupQueueSources(queue))].filter((source) => isPending(source) && matchesSessionFollowupRun(source, params))
		}];
	});
	let consumed = false;
	return (sessionId = params.sessionId) => {
		if (consumed) return 0;
		consumed = true;
		let removed = 0;
		for (const { key, queue, isPending, sources } of captures) {
			params.assertCurrent();
			if (FOLLOWUP_QUEUES.get(key) !== queue) continue;
			const matchesCurrentTarget = (source) => isPending(source) && matchesSessionFollowupRun(source, {
				...params,
				sessionId
			});
			const current = sources.filter(matchesCurrentTarget);
			const pending = current.filter((source) => queue.items.includes(source));
			const summaries = current.filter((source) => queue.summarySources.includes(source) || queue.summaryElisions.some((entry) => {
				const mapped = entry.sourceRefs.get(source) ?? source;
				return entry.sources.includes(mapped) && matchesCurrentTarget(mapped);
			}));
			removeQueuedItemsByRef(queue.items, pending);
			consumeQueueSummaryDelivery(queue, {
				sources: summaries,
				droppedCount: summaries.length
			}, false);
			const detached = /* @__PURE__ */ new Set([...pending, ...summaries]);
			removed += detached.size;
			completeFollowupRuns(detached, (error) => {
				defaultRuntime.error?.(`followup queue cancellation settlement failed: ${String(error)}`);
			});
			params.assertCurrent();
			if (FOLLOWUP_QUEUES.get(key) === queue && !queue.draining && queue.items.length === 0 && queue.inFlight.size === 0 && queue.droppedCount === 0) {
				FOLLOWUP_QUEUES.delete(key);
				clearFollowupDrainCallback(key);
			}
		}
		return removed;
	};
}
function clearSessionLifecycleQueues(params) {
	params.assertCurrent();
	const { keys, sessionKeyAliases } = resolveSessionLifecycleQueueKeys(params);
	return {
		followupCleared: prepareSessionFollowupCleanup({
			...params,
			keys,
			sessionKeyAliases
		})(),
		laneCleared: clearSessionLifecycleLanes(params),
		keys
	};
}
function prepareSessionLifecycleQueueCleanup(params) {
	params.assertCurrent();
	const { keys, sessionKeyAliases, matchesLaneEntry } = resolveSessionLifecycleQueueKeys(params);
	const clearFollowups = prepareSessionFollowupCleanup({
		...params,
		keys,
		sessionKeyAliases
	});
	const lanes = keys.map((key) => prepareCommandLaneClear(resolveSessionLane(key), matchesLaneEntry(key)));
	return (sessionId = params.sessionId) => {
		params.assertCurrent();
		const followupCleared = clearFollowups(sessionId);
		let laneCleared = 0;
		for (const clearLane of lanes) {
			params.assertCurrent();
			laneCleared += clearLane((target) => !target || sessionId === void 0 || target.sessionId === sessionId);
		}
		return {
			followupCleared,
			laneCleared,
			keys
		};
	};
}
function clearSessionLifecycleLanes(params) {
	const { keys, matchesLaneEntry } = resolveSessionLifecycleQueueKeys(params);
	let laneCleared = 0;
	for (const key of keys) {
		params.assertCurrent();
		laneCleared += clearCommandLane(resolveSessionLane(key), matchesLaneEntry(key));
	}
	return laneCleared;
}
function hasSessionLifecycleQueueWork(params) {
	const { keys, sessionKeyAliases, matchesLaneEntry } = resolveSessionLifecycleQueueKeys(params);
	for (const key of keys) {
		const queue = FOLLOWUP_QUEUES.get(key);
		if (queue && [...followupQueueSources(queue), ...queue.inFlight].some((source) => matchesSessionFollowupRun(source, {
			...params,
			sessionKeyAliases
		}))) return true;
	}
	return keys.some((key) => countQueuedCommandsInLane(resolveSessionLane(key), matchesLaneEntry(key)) > 0);
}
//#endregion
export { prepareSessionLifecycleQueueCleanup as a, prepareSessionFollowupCleanup as i, clearSessionLifecycleQueues as n, hasSessionLifecycleQueueWork as r, clearSessionLifecycleLanes as t };
