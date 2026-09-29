import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as clearCommandLane } from "./command-queue-CaY517ob.mjs";
import { S as removeQueuedItemsByRef, n as FOLLOWUP_QUEUES, r as clearFollowupQueue, u as completeFollowupRunLifecycle } from "./state-B1aZH2hx.mjs";
import { t as resolveEmbeddedSessionLane } from "./lanes-CVttd5qX.mjs";
import { t as clearFollowupDrainCallback, u as consumeQueueSummaryDelivery } from "./drain-DGjQsdif.mjs";
//#region src/auto-reply/reply/queue/cleanup.ts
/** Capture pending sources before Stop callbacks can replace their queue or session. */
function prepareSessionFollowupCleanup(params) {
	const keys = new Set(params.keys.map((key) => normalizeOptionalString(key)).filter((key) => key !== void 0));
	const targetAgentId = normalizeAgentId(params.agentId);
	const captures = [...keys].flatMap((key) => {
		const queue = FOLLOWUP_QUEUES.get(key);
		if (!queue) return [];
		const isPending = (source) => source.steerPending?.phase !== "injecting" && !queue.inFlight.has(source) && !queue.activeSummarySources.has(source);
		return [{
			key,
			queue,
			isPending,
			sources: [.../* @__PURE__ */ new Set([
				...queue.items,
				...queue.summarySources,
				...queue.summaryElisions.flatMap((entry) => entry.sources)
			])].filter((source) => isPending(source) && normalizeOptionalString(source.run.agentId) !== void 0 && normalizeAgentId(source.run.agentId) === targetAgentId && source.run.sessionKey === params.sessionKey && source.run.sessionId === params.sessionId && (source.admissionSessionId === void 0 || source.admissionSessionId === params.sessionId)).map((source) => ({
				source,
				run: source.run,
				agentId: source.run.agentId,
				sessionKey: source.run.sessionKey,
				sessionId: source.run.sessionId,
				admissionSessionId: source.admissionSessionId,
				lifecycle: source.turnAdoptionLifecycle
			}))
		}];
	});
	let consumed = false;
	return () => {
		if (consumed) return 0;
		consumed = true;
		let removed = 0;
		for (const { key, queue, isPending, sources } of captures) {
			params.assertCurrent();
			if (FOLLOWUP_QUEUES.get(key) !== queue) continue;
			const matchesCapture = (source, capture) => isPending(source) && source.run === capture.run && source.run.agentId === capture.agentId && source.run.sessionKey === capture.sessionKey && source.run.sessionId === capture.sessionId && source.admissionSessionId === capture.admissionSessionId && source.turnAdoptionLifecycle === capture.lifecycle;
			const current = sources.filter((capture) => matchesCapture(capture.source, capture));
			const pending = current.flatMap(({ source }) => queue.items.includes(source) ? [source] : []);
			const summaries = current.filter((capture) => {
				const source = capture.source;
				return queue.summarySources.includes(source) || queue.summaryElisions.some((entry) => {
					const mapped = entry.sourceRefs.get(source) ?? source;
					return entry.sources.includes(mapped) && matchesCapture(mapped, capture);
				});
			}).map(({ source }) => source);
			removeQueuedItemsByRef(queue.items, pending);
			consumeQueueSummaryDelivery(queue, {
				sources: summaries,
				droppedCount: summaries.length
			}, false);
			const detached = /* @__PURE__ */ new Set([...pending, ...summaries]);
			removed += detached.size;
			for (const source of detached) try {
				completeFollowupRunLifecycle(source);
			} catch (error) {
				defaultRuntime.error?.(`followup queue cancellation settlement failed: ${String(error)}`);
			}
			params.assertCurrent();
			if (FOLLOWUP_QUEUES.get(key) === queue && !queue.draining && !queue.drainOwner && queue.items.length === 0 && queue.inFlight.size === 0 && queue.droppedCount === 0) {
				FOLLOWUP_QUEUES.delete(key);
				clearFollowupDrainCallback(key);
			}
		}
		return removed;
	};
}
function clearSessionQueues(keys) {
	const seen = /* @__PURE__ */ new Set();
	let followupCleared = 0;
	let laneCleared = 0;
	const clearedKeys = [];
	for (const key of keys) {
		const cleaned = normalizeOptionalString(key);
		if (!cleaned || seen.has(cleaned)) continue;
		seen.add(cleaned);
		clearedKeys.push(cleaned);
		followupCleared += clearFollowupQueue(cleaned);
		clearFollowupDrainCallback(cleaned);
		laneCleared += clearCommandLane(resolveEmbeddedSessionLane(cleaned));
	}
	return {
		followupCleared,
		laneCleared,
		keys: clearedKeys
	};
}
//#endregion
export { prepareSessionFollowupCleanup as n, clearSessionQueues as t };
