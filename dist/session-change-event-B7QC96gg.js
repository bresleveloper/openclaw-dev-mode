import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import { s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import "./agent-scope-B2Pk_xhT.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-BxAUeF6t.js";
import { t as setSafeTimeout } from "./timer-delay-T0mHtzex.js";
import { a as mergeAgentRunTerminalOutcome, d as normalizeBlockedLivenessWaitStatus, i as isStickyAgentRunTerminalOutcome, n as buildAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-Dv8Iorx2.js";
import { l as loadGatewaySessionRow } from "./session-utils-D5cDecWw.js";
import { l as isNonTerminalAgentRunStatus } from "./subagent-announce-origin-COyWymGb.js";
import { r as resolveVisibleActiveSessionRunState } from "./session-active-runs-BhZGmpNB.js";
import { t as buildGatewaySessionEventFields } from "./session-event-payload-Ditmg1lP.js";
//#region src/gateway/server-methods/agent-wait-dedupe.ts
const AGENT_WAITERS_BY_RUN_ID = /* @__PURE__ */ new Map();
function normalizeTerminalOutcomeForWaitSnapshot(outcome) {
	if (outcome.reason === "hard_timeout") return {
		status: outcome.status,
		error: outcome.error
	};
	return normalizeBlockedLivenessWaitStatus(outcome);
}
function parseRunIdFromDedupeKey(key) {
	if (key.startsWith("agent:")) return key.slice(6) || null;
	if (key.startsWith("chat:")) return key.slice(5) || null;
	return null;
}
function asString(value) {
	return typeof value === "string" && value.trim() ? value : void 0;
}
function buildDedupeTerminalSnapshot(params) {
	const terminalOutcome = buildAgentRunTerminalOutcome({
		status: params.status,
		livenessState: params.livenessState,
		error: params.error,
		stopReason: params.stopReason,
		timeoutPhase: params.timeoutPhase,
		providerStarted: params.providerStarted,
		startedAt: params.startedAt,
		endedAt: params.endedAt
	});
	const normalized = normalizeTerminalOutcomeForWaitSnapshot(terminalOutcome);
	return {
		status: normalized.status,
		startedAt: params.startedAt,
		endedAt: params.endedAt,
		error: normalized.status === "error" ? normalized.error : normalized.status === "timeout" ? terminalOutcome.error : void 0,
		stopReason: params.stopReason,
		livenessState: params.livenessState,
		...params.yielded ? { yielded: params.yielded } : {},
		...terminalOutcome.timeoutPhase ? { timeoutPhase: terminalOutcome.timeoutPhase } : {},
		...terminalOutcome.providerStarted !== void 0 ? { providerStarted: terminalOutcome.providerStarted } : {}
	};
}
function removeWaiter(runId, waiter) {
	const waiters = AGENT_WAITERS_BY_RUN_ID.get(runId);
	if (!waiters) return;
	waiters.delete(waiter);
	if (waiters.size === 0) AGENT_WAITERS_BY_RUN_ID.delete(runId);
}
function addWaiter(runId, waiter) {
	const normalizedRunId = runId.trim();
	if (!normalizedRunId) return () => {};
	const existing = AGENT_WAITERS_BY_RUN_ID.get(normalizedRunId);
	if (existing) {
		existing.add(waiter);
		return () => removeWaiter(normalizedRunId, waiter);
	}
	AGENT_WAITERS_BY_RUN_ID.set(normalizedRunId, /* @__PURE__ */ new Set([waiter]));
	return () => removeWaiter(normalizedRunId, waiter);
}
function notifyWaiters(runId) {
	const normalizedRunId = runId.trim();
	if (!normalizedRunId) return;
	const waiters = AGENT_WAITERS_BY_RUN_ID.get(normalizedRunId);
	if (!waiters || waiters.size === 0) return;
	for (const waiter of waiters) waiter();
}
function readTerminalSnapshotFromDedupeEntry(entry) {
	const payload = entry.payload;
	const status = typeof payload?.status === "string" ? payload.status : void 0;
	if (isNonTerminalAgentRunStatus(status)) return null;
	const startedAt = asFiniteNumber(payload?.startedAt);
	const endedAt = asFiniteNumber(payload?.endedAt) ?? entry.ts;
	const resultMeta = asOptionalRecord(asOptionalRecord(payload?.result)?.meta);
	const stopReason = asString(payload?.stopReason) ?? asString(resultMeta?.stopReason);
	const livenessState = asString(payload?.livenessState) ?? asString(resultMeta?.livenessState);
	const yielded = payload?.yielded === true || resultMeta?.yielded === true;
	const timeoutPhase = payload?.timeoutPhase ?? resultMeta?.timeoutPhase;
	const providerStarted = payload?.providerStarted ?? resultMeta?.providerStarted;
	const errorMessage = typeof payload?.error === "string" ? payload.error : typeof payload?.summary === "string" ? payload.summary : entry.error?.message;
	const terminalStatus = status === "ok" || status === "timeout" || status === "error" ? status : entry.ok ? null : "error";
	if (!terminalStatus) return null;
	return buildDedupeTerminalSnapshot({
		status: terminalStatus,
		startedAt,
		endedAt,
		error: errorMessage,
		stopReason,
		livenessState,
		yielded,
		timeoutPhase,
		providerStarted
	});
}
function terminalOutcomeFromWaitSnapshot(snapshot) {
	if (snapshot.pendingError) return;
	return buildAgentRunTerminalOutcome(snapshot);
}
function readTerminalSnapshotFromGatewayDedupe(params) {
	if (params.ignoreAgentTerminalSnapshot) {
		const chatEntry = params.dedupe.get(`chat:${params.runId}`);
		if (!chatEntry) return null;
		return readTerminalSnapshotFromDedupeEntry(chatEntry);
	}
	const chatEntry = params.dedupe.get(`chat:${params.runId}`);
	const chatSnapshot = chatEntry ? readTerminalSnapshotFromDedupeEntry(chatEntry) : null;
	const agentEntry = params.dedupe.get(`agent:${params.runId}`);
	const agentSnapshot = agentEntry ? readTerminalSnapshotFromDedupeEntry(agentEntry) : null;
	if (agentEntry) {
		if (!agentSnapshot) {
			if (chatSnapshot && chatEntry && chatEntry.ts > agentEntry.ts) return chatSnapshot;
			return null;
		}
	}
	if (agentSnapshot && chatSnapshot && agentEntry && chatEntry) return chatEntry.ts > agentEntry.ts ? chatSnapshot : agentSnapshot;
	return agentSnapshot ?? chatSnapshot;
}
async function waitForTerminalGatewayDedupe(params) {
	const initial = readTerminalSnapshotFromGatewayDedupe(params);
	if (initial) return initial;
	if (params.timeoutMs <= 0 || params.signal?.aborted) return null;
	return await new Promise((resolve) => {
		let settled = false;
		const finish = (snapshot) => {
			if (settled) return;
			settled = true;
			if (timeoutHandle) clearTimeout(timeoutHandle);
			if (onAbort) params.signal?.removeEventListener("abort", onAbort);
			removeWaiterLocal?.();
			resolve(snapshot);
		};
		const onWake = () => {
			const snapshot = readTerminalSnapshotFromGatewayDedupe(params);
			if (snapshot) finish(snapshot);
		};
		const removeWaiterLocal = addWaiter(params.runId, onWake);
		onWake();
		if (settled) return;
		const timeoutHandle = setSafeTimeout(() => finish(null), params.timeoutMs);
		timeoutHandle.unref?.();
		const onAbort = () => finish(null);
		params.signal?.addEventListener("abort", onAbort, { once: true });
	});
}
function setGatewayDedupeEntry(params) {
	const existing = params.dedupe.get(params.key);
	const existingSnapshot = existing ? readTerminalSnapshotFromDedupeEntry(existing) : null;
	const incomingSnapshot = readTerminalSnapshotFromDedupeEntry(params.entry);
	const existingOutcome = existingSnapshot ? terminalOutcomeFromWaitSnapshot(existingSnapshot) : void 0;
	const incomingOutcome = incomingSnapshot ? terminalOutcomeFromWaitSnapshot(incomingSnapshot) : void 0;
	if (existingOutcome && isStickyAgentRunTerminalOutcome(existingOutcome) && !incomingOutcome) return;
	if (existingOutcome && incomingOutcome && isStickyAgentRunTerminalOutcome(existingOutcome)) {
		if (mergeAgentRunTerminalOutcome(existingOutcome, incomingOutcome) === existingOutcome) return;
	}
	params.dedupe.set(params.key, params.entry);
	const runId = parseRunIdFromDedupeKey(params.key);
	if (!runId) return;
	if (!incomingSnapshot) return;
	notifyWaiters(runId);
}
//#endregion
//#region src/gateway/server-methods/session-change-event.ts
function emitSessionsChanged(context, payload) {
	const connIds = context.getSessionEventSubscriberConnIds();
	if (connIds.size === 0) return;
	const sessionRow = payload.sessionKey ? loadGatewaySessionRow(payload.sessionKey, payload.sessionKey === "global" && payload.agentId ? { agentId: payload.agentId } : void 0) : null;
	const defaultAgentId = resolveDefaultAgentId(context.getRuntimeConfig());
	const activeRunState = sessionRow ? resolveVisibleActiveSessionRunState({
		context,
		requestedKey: payload.sessionKey ?? sessionRow.key,
		canonicalKey: sessionRow.key,
		sessionId: sessionRow.sessionId,
		agentId: sessionRow.key === "global" ? payload.agentId : void 0,
		defaultAgentId
	}) : null;
	context.broadcastToConnIds("sessions.changed", {
		...payload,
		ts: Date.now(),
		...sessionRow ? {
			...buildGatewaySessionEventFields({
				sessionRow,
				agentId: payload.agentId,
				hasActiveRun: activeRunState?.active,
				activeRunIds: activeRunState?.runIds
			}),
			effectiveFastMode: sessionRow.effectiveFastMode,
			effectiveFastModeSource: sessionRow.effectiveFastModeSource,
			fastAutoOnSeconds: sessionRow.fastAutoOnSeconds,
			traceLevel: sessionRow.traceLevel,
			pluginExtensions: sessionRow.pluginExtensions
		} : {}
	}, connIds, { dropIfSlow: true });
}
//#endregion
export { waitForTerminalGatewayDedupe as i, readTerminalSnapshotFromGatewayDedupe as n, setGatewayDedupeEntry as r, emitSessionsChanged as t };
