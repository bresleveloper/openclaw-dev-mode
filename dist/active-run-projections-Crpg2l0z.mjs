import { F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { c as ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY, f as EMBEDDED_RUN_WAITERS, i as ACTIVE_EMBEDDED_RUNS, s as ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE } from "./run-state-DZ4Vfz1J.mjs";
import { t as notifyGatewayWorkMetricsChanged } from "./gateway-work-metrics-events-SooEjUbR.mjs";
import { t as diagnosticLogger } from "./diagnostic-runtime-BpQSBSkN.mjs";
import { S as waitForReplyRunEndBySessionId, _ as resolveActiveReplyRunSessionId, d as isReplyRunActiveForSessionId, m as listActiveReplyRunSessionKeys, p as listActiveReplyRunSessionIds, s as getActiveReplyRunCount } from "./reply-run-registry.registry-CmcnzV4X.mjs";
//#region src/agents/embedded-agent-runner/active-run-projections.ts
function isEmbeddedAgentRunActive(sessionId) {
	const active = ACTIVE_EMBEDDED_RUNS.has(sessionId) || isReplyRunActiveForSessionId(sessionId);
	if (active) diagnosticLogger.debug(`run active check: sessionId=${sessionId} active=true`);
	return active;
}
/** Counts active embedded runs while including auto-reply registry runs for shared sessions. */
function getActiveEmbeddedRunCount() {
	let activeCount = ACTIVE_EMBEDDED_RUNS.size;
	for (const sessionId of listActiveReplyRunSessionIds()) if (!ACTIVE_EMBEDDED_RUNS.has(sessionId)) activeCount += 1;
	return Math.max(activeCount, getActiveReplyRunCount());
}
function sortedSessionIdentifiers(identifiers) {
	return [...new Set(identifiers)].toSorted((a, b) => a.localeCompare(b));
}
/** Lists active embedded-run session keys from both embedded and auto-reply registries. */
function listActiveEmbeddedRunSessionKeys() {
	return sortedSessionIdentifiers([...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.keys(), ...listActiveReplyRunSessionKeys()]);
}
/** Lists active embedded-run session ids from all embedded-run lookup maps. */
function listActiveEmbeddedRunSessionIds() {
	return sortedSessionIdentifiers([
		...ACTIVE_EMBEDDED_RUNS.keys(),
		...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.values(),
		...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE.values(),
		...listActiveReplyRunSessionIds()
	]);
}
/** Resolves the current session id for an active run after resets or compaction. */
function resolveActiveEmbeddedRunSessionId(sessionKey, options) {
	const normalizedSessionKey = sessionKey.trim();
	if (!normalizedSessionKey) return;
	return resolveActiveReplyRunSessionId(normalizedSessionKey, options) ?? ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.get(normalizedSessionKey);
}
function waitForCurrentEmbeddedAgentRunEnd(sessionId, timeoutMs, handle, signal) {
	const isHandleActive = () => handle ? ACTIVE_EMBEDDED_RUNS.get(sessionId) === handle : ACTIVE_EMBEDDED_RUNS.has(sessionId);
	if (!isHandleActive()) return handle ? Promise.resolve(true) : waitForReplyRunEndBySessionId(sessionId, timeoutMs);
	const timeoutLabel = timeoutMs === null ? "none" : String(timeoutMs);
	diagnosticLogger.debug(`waiting for run end: sessionId=${sessionId} timeoutMs=${timeoutLabel}`);
	return new Promise((resolve) => {
		const waiters = EMBEDDED_RUN_WAITERS.get(sessionId) ?? /* @__PURE__ */ new Set();
		let settled = false;
		const finish = (ended) => {
			if (settled) return;
			settled = true;
			waiters.delete(waiter);
			if (waiters.size === 0 && EMBEDDED_RUN_WAITERS.get(sessionId) === waiters) EMBEDDED_RUN_WAITERS.delete(sessionId);
			if (waiter.timer) clearTimeout(waiter.timer);
			signal?.removeEventListener("abort", onAbort);
			resolve(ended);
		};
		const onAbort = () => finish(false);
		const waiter = {
			resolve: finish,
			handle
		};
		if (timeoutMs !== null) waiter.timer = setTimeout(() => {
			diagnosticLogger.warn(`wait timeout: sessionId=${sessionId} timeoutMs=${timeoutMs}`);
			finish(false);
		}, resolveTimerTimeoutMs(timeoutMs, 100, 100));
		waiters.add(waiter);
		EMBEDDED_RUN_WAITERS.set(sessionId, waiters);
		signal?.addEventListener("abort", onAbort, { once: true });
		if (signal?.aborted) onAbort();
		else if (!isHandleActive()) finish(true);
	});
}
async function waitForEmbeddedAgentRunEnd(sessionId, timeoutMs = 15e3) {
	if (!sessionId) return true;
	const deadline = timeoutMs === null ? void 0 : Date.now() + timeoutMs;
	while (isEmbeddedAgentRunActive(sessionId)) {
		const remainingMs = deadline === void 0 ? null : deadline - Date.now();
		if (remainingMs !== null && remainingMs <= 0 || !await waitForCurrentEmbeddedAgentRunEnd(sessionId, remainingMs)) return false;
	}
	return true;
}
function notifyEmbeddedRunEnded(sessionId, endedHandle, aborted = false) {
	notifyGatewayWorkMetricsChanged();
	const waiters = EMBEDDED_RUN_WAITERS.get(sessionId);
	if (!waiters || waiters.size === 0) return;
	const sessionIdle = !ACTIVE_EMBEDDED_RUNS.has(sessionId);
	diagnosticLogger.debug(`notifying waiters: sessionId=${sessionId} waiterCount=${waiters.size}`);
	for (const waiter of waiters) {
		if (aborted && !waiter.settleOnAbort) continue;
		if (waiter.handle ? waiter.handle !== endedHandle : !sessionIdle) continue;
		waiters.delete(waiter);
		if (waiter.timer) clearTimeout(waiter.timer);
		waiter.resolve(true);
	}
	if (waiters.size === 0) EMBEDDED_RUN_WAITERS.delete(sessionId);
}
//#endregion
export { notifyEmbeddedRunEnded as a, waitForEmbeddedAgentRunEnd as c, listActiveEmbeddedRunSessionKeys as i, isEmbeddedAgentRunActive as n, resolveActiveEmbeddedRunSessionId as o, listActiveEmbeddedRunSessionIds as r, waitForCurrentEmbeddedAgentRunEnd as s, getActiveEmbeddedRunCount as t };
