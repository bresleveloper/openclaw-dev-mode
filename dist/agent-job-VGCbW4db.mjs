import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-CWk2dk1h.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import { _t as normalizeAgentRunTerminalReplySnapshot, gt as mergeAgentRunTerminalReplySnapshot, xt as normalizeAgentRunTerminalReceipt } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { t as setSafeTimeout } from "./timer-delay-DjFOGnXg.mjs";
import { d as getAgentRunLifecycleGeneration } from "./agent-run-registry-DO6Dg2r0.mjs";
import { f as onAgentEvent } from "./agent-events-BOSJcayE.mjs";
import { a as hasExecutionSettlement } from "./agent-run-terminal-outcome-CgoAW2Q7.mjs";
import { r as formatErrorMessageForDisplay } from "./error-diagnostics-805LTf-V.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent, n as buildAgentRunTerminalOutcome, o as isStickyAgentRunTerminalOutcome, t as AGENT_RUN_TERMINAL_RETRY_GRACE_MS } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { t as mergeAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-merge-DXNYLPhQ.mjs";
import { n as isNonTerminalAgentRunStatus, t as normalizeAgentRunTerminalDeliverySnapshot } from "./agent-run-terminal-delivery-vdpDQeM7.mjs";
//#region src/gateway/agent-turn/agent-job.ts
const AGENT_RUN_CACHE_TTL_MS = 6e5;
const AGENT_RUN_CACHE_MAX_ENTRIES = 5e3;
const agentJobState = resolveGlobalSingleton(Symbol.for("openclaw.agentJobState"), () => ({
	jobs: /* @__PURE__ */ new Map(),
	oldestCachedAt: Infinity,
	runStarts: /* @__PURE__ */ new Map(),
	pendingErrors: /* @__PURE__ */ new Map(),
	pendingTimeouts: /* @__PURE__ */ new Map(),
	waiters: /* @__PURE__ */ new Map(),
	version: 0
}), (state) => {
	for (const pending of state.pendingErrors.values()) clearTimeout(pending.timer);
	for (const pending of state.pendingTimeouts.values()) clearTimeout(pending.timer);
	state.jobs.clear();
	state.oldestCachedAt = Infinity;
	state.runStarts.clear();
	state.pendingErrors.clear();
	state.pendingTimeouts.clear();
	const waiters = Array.from(state.waiters.values()).flatMap((entries) => Array.from(entries));
	state.waiters.clear();
	for (const waiter of waiters) waiter(true);
});
const agentJobs = agentJobState.jobs;
const agentRunStarts = agentJobState.runStarts;
const pendingAgentRunErrors = agentJobState.pendingErrors;
const pendingAgentRunTimeouts = agentJobState.pendingTimeouts;
const agentRunWaiters = agentJobState.waiters;
let agentRunListenerStarted = false;
function captureAgentJobSession(routing) {
	if (!routing?.sessionKey || !routing.sessionId || !routing.lifecycleGeneration) return;
	return {
		sessionKey: routing.sessionKey,
		sessionId: routing.sessionId,
		agentId: routing.agentId,
		lifecycleGeneration: routing.lifecycleGeneration
	};
}
/** Retained routing locates a current sharing check; it never keeps execution authority alive. */
function getAgentJobSession(runId, source) {
	pruneAgentRunCache();
	const job = agentJobs.get(runId);
	const session = (job && getCanonicalAgentRunSnapshot(job.snapshotsBySource, source)?.session) ?? (source ? void 0 : pendingAgentRunErrors.get(runId)?.snapshot.session ?? pendingAgentRunTimeouts.get(runId)?.snapshot.session);
	return session?.lifecycleGeneration === getAgentRunLifecycleGeneration() ? session : void 0;
}
function nextAgentRunVersion() {
	agentJobState.version += 1;
	return agentJobState.version;
}
function pruneAgentRunCache(now = Date.now()) {
	if (now - agentJobState.oldestCachedAt <= AGENT_RUN_CACHE_TTL_MS) return;
	let oldestCachedAt = Infinity;
	for (const [runId, job] of agentJobs) {
		if (now - job.cachedAt <= AGENT_RUN_CACHE_TTL_MS) {
			oldestCachedAt = Math.min(oldestCachedAt, job.cachedAt);
			continue;
		}
		agentJobs.delete(runId);
	}
	agentJobState.oldestCachedAt = oldestCachedAt;
}
function enforceAgentRunCacheMaxEntries() {
	if (agentJobs.size <= AGENT_RUN_CACHE_MAX_ENTRIES) return;
	const toRemove = agentJobs.size - AGENT_RUN_CACHE_MAX_ENTRIES;
	let removed = 0;
	for (const runId of agentJobs.keys()) {
		if (removed >= toRemove) break;
		if ((agentRunWaiters.get(runId)?.size ?? 0) > 0) continue;
		agentJobs.delete(runId);
		removed += 1;
	}
}
function terminalOutcomeFromSnapshot(snapshot) {
	if (snapshot.pendingError) return;
	return buildAgentRunTerminalOutcome(snapshot);
}
function shouldPreserveTerminalSnapshot(existing, incoming) {
	const existingOutcome = terminalOutcomeFromSnapshot(existing);
	const incomingOutcome = terminalOutcomeFromSnapshot(incoming);
	if (!existingOutcome || !incomingOutcome) return false;
	return mergeAgentRunTerminalOutcome(existingOutcome, incomingOutcome) === existingOutcome;
}
function mergeSnapshot(existing, incoming) {
	if (!existing) return incoming;
	const canonical = shouldPreserveTerminalSnapshot(existing, incoming) ? existing : incoming;
	if (!(existing.session?.sessionKey === incoming.session?.sessionKey && existing.session?.sessionId === incoming.session?.sessionId && existing.session?.agentId === incoming.session?.agentId && existing.session?.lifecycleGeneration === incoming.session?.lifecycleGeneration)) return canonical;
	const terminalReply = mergeAgentRunTerminalReplySnapshot(existing.terminalReply, incoming.terminalReply);
	const terminalDelivery = incoming.terminalDelivery ?? existing.terminalDelivery;
	const terminalReceipt = incoming.terminalReceipt ?? existing.terminalReceipt;
	return {
		...canonical,
		...terminalDelivery ? { terminalDelivery } : {},
		...terminalReceipt ? { terminalReceipt } : {},
		...terminalReply ? { terminalReply } : {},
		cachedAt: incoming.cachedAt,
		recordedAt: incoming.recordedAt,
		version: incoming.version
	};
}
function recordAgentRunSnapshot(snapshot, version = nextAgentRunVersion()) {
	const entry = {
		...snapshot,
		cachedAt: Date.now(),
		version
	};
	pruneAgentRunCache(entry.cachedAt);
	const snapshotsBySource = agentJobs.get(entry.runId)?.snapshotsBySource ?? /* @__PURE__ */ new Map();
	const sourceSnapshot = mergeSnapshot(snapshotsBySource.get(entry.source), entry);
	snapshotsBySource.set(entry.source, sourceSnapshot);
	agentJobs.set(entry.runId, {
		cachedAt: entry.cachedAt,
		snapshotsBySource
	});
	agentJobState.oldestCachedAt = Math.min(agentJobState.oldestCachedAt, entry.cachedAt);
	enforceAgentRunCacheMaxEntries();
	for (const waiter of agentRunWaiters.get(entry.runId) ?? []) waiter();
}
function clearPendingAgentRunTerminals(runId) {
	for (const pendingRuns of [pendingAgentRunErrors, pendingAgentRunTimeouts]) {
		const pending = pendingRuns.get(runId);
		if (pending) {
			clearTimeout(pending.timer);
			pendingRuns.delete(runId);
		}
	}
}
function beginAgentJob(runId, startedAt) {
	nextAgentRunVersion();
	clearPendingAgentRunTerminals(runId);
	agentJobs.delete(runId);
	if (startedAt !== void 0) agentRunStarts.set(runId, startedAt);
}
function mergePendingAgentRunTerminal(snapshot) {
	return [pendingAgentRunErrors, pendingAgentRunTimeouts].reduce((current, pendingRuns) => {
		const pending = pendingRuns.get(snapshot.runId)?.snapshot;
		return pending && shouldPreserveTerminalSnapshot(pending, current) ? pending : current;
	}, snapshot);
}
function schedulePendingAgentRunTerminal(pendingRuns, snapshot) {
	const terminalSnapshot = mergePendingAgentRunTerminal(snapshot);
	if (terminalSnapshot !== snapshot) {
		terminalSnapshot.version = snapshot.version;
		return;
	}
	const replacesPendingTimeout = pendingAgentRunTimeouts.has(snapshot.runId);
	clearPendingAgentRunTerminals(snapshot.runId);
	const timer = setSafeTimeout(() => {
		const pending = pendingRuns.get(snapshot.runId);
		if (!pending || pending.timer !== timer) return;
		if (pendingRuns === pendingAgentRunErrors && !replacesPendingTimeout && terminalOutcomeFromSnapshot(pending.snapshot)?.reason === "failed" && agentRunWaiters.has(snapshot.runId)) {
			pending.timer = void 0;
			return;
		}
		pendingRuns.delete(snapshot.runId);
		recordAgentRunSnapshot(pending.snapshot, pending.snapshot.version);
	}, AGENT_RUN_TERMINAL_RETRY_GRACE_MS);
	timer.unref?.();
	pendingRuns.set(snapshot.runId, {
		snapshot,
		timer
	});
}
function createPendingErrorTimeoutSnapshot(snapshot) {
	return {
		status: "timeout",
		startedAt: snapshot.startedAt,
		error: snapshot.error,
		pendingError: true,
		session: snapshot.session,
		...snapshot.providerStarted !== void 0 ? { providerStarted: snapshot.providerStarted } : {},
		...snapshot.terminalDelivery ? { terminalDelivery: snapshot.terminalDelivery } : {}
	};
}
function createSnapshotFromLifecycleEvent(params) {
	const { runId, phase, data } = params;
	const startedAt = typeof data?.startedAt === "number" ? data.startedAt : agentRunStarts.get(runId);
	const endedAt = typeof data?.endedAt === "number" ? data.endedAt : void 0;
	const terminalOutcome = buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase,
		data,
		startedAt,
		endedAt
	});
	const legacyBareAbort = !hasExecutionSettlement(data) && terminalOutcome.reason === "aborted" && data?.stopReason == null && data?.status == null;
	const terminalDelivery = normalizeAgentRunTerminalDeliverySnapshot(data?.terminalDelivery);
	const terminalReply = normalizeAgentRunTerminalReplySnapshot(data?.terminalReply);
	const normalizedTerminalReceipt = normalizeAgentRunTerminalReceipt(data?.terminalReceipt);
	const terminalReceipt = normalizedTerminalReceipt?.runId === runId ? normalizedTerminalReceipt : void 0;
	return {
		runId,
		source: "lifecycle",
		session: params.session,
		recordedAt: Date.now(),
		status: legacyBareAbort ? "timeout" : terminalOutcome.status,
		startedAt,
		endedAt,
		error: legacyBareAbort ? void 0 : terminalOutcome.error,
		stopReason: legacyBareAbort ? void 0 : terminalOutcome.stopReason,
		livenessState: terminalOutcome.livenessState,
		...data?.yielded === true ? { yielded: true } : {},
		...terminalOutcome.timeoutPhase ? { timeoutPhase: terminalOutcome.timeoutPhase } : {},
		...terminalOutcome.providerStarted !== void 0 ? { providerStarted: terminalOutcome.providerStarted } : {},
		...terminalDelivery ? { terminalDelivery } : {},
		...terminalReply ? { terminalReply } : {},
		...terminalReceipt ? { terminalReceipt } : {},
		version: nextAgentRunVersion()
	};
}
function ensureAgentRunListener() {
	if (agentRunListenerStarted) return;
	agentRunListenerStarted = true;
	onAgentEvent((evt) => {
		if (!evt || evt.stream !== "lifecycle") return;
		const phase = evt.data?.phase;
		if (phase === "start") {
			const startedAt = typeof evt.data?.startedAt === "number" ? evt.data.startedAt : Date.now();
			beginAgentJob(evt.runId, startedAt);
			return;
		}
		if (phase !== "end" && phase !== "error") return;
		const snapshot = createSnapshotFromLifecycleEvent({
			runId: evt.runId,
			phase,
			data: evt.data,
			session: captureAgentJobSession(evt)
		});
		agentRunStarts.delete(evt.runId);
		const executionSettled = hasExecutionSettlement(evt.data);
		if (!executionSettled && phase === "error" && evt.data?.fallbackExhaustedFailure !== true) {
			schedulePendingAgentRunTerminal(pendingAgentRunErrors, snapshot);
			return;
		}
		if (!executionSettled && phase === "end" && snapshot.status === "timeout") {
			schedulePendingAgentRunTerminal(pendingAgentRunTimeouts, snapshot);
			return;
		}
		const terminalSnapshot = mergePendingAgentRunTerminal(snapshot);
		clearPendingAgentRunTerminals(evt.runId);
		recordAgentRunSnapshot(terminalSnapshot, snapshot.version);
	});
}
function parseDedupeObservation(entry) {
	const payload = asOptionalRecord(entry.payload);
	const status = typeof payload?.status === "string" ? payload.status : void 0;
	if (isNonTerminalAgentRunStatus(status)) return { state: "active" };
	const terminalStatus = status === "completed" ? "ok" : status === "ok" || status === "timeout" || status === "error" ? status : entry.ok ? void 0 : "error";
	if (!terminalStatus) return { state: "untracked" };
	const resultMeta = asOptionalRecord(asOptionalRecord(payload?.result)?.meta);
	const terminalReply = normalizeAgentRunTerminalReplySnapshot(payload?.terminalReply ?? resultMeta?.terminalReply);
	const startedAt = asFiniteNumber(payload?.startedAt);
	const endedAt = asFiniteNumber(payload?.endedAt) ?? entry.ts;
	const stopReason = readNonBlankString(payload?.stopReason) ?? readNonBlankString(resultMeta?.stopReason);
	const livenessState = readNonBlankString(payload?.livenessState) ?? readNonBlankString(resultMeta?.livenessState);
	const errorMessage = typeof payload?.error === "string" ? payload.error : typeof payload?.summary === "string" ? payload.summary : entry.error?.message;
	const terminalOutcome = buildAgentRunTerminalOutcome({
		status: terminalStatus,
		startedAt,
		endedAt,
		error: errorMessage === void 0 ? void 0 : formatErrorMessageForDisplay(entry.error, errorMessage),
		stopReason,
		livenessState,
		timeoutPhase: payload?.timeoutPhase ?? resultMeta?.timeoutPhase,
		providerStarted: payload?.providerStarted ?? resultMeta?.providerStarted
	});
	return {
		state: "terminal",
		snapshot: {
			status: terminalOutcome.status,
			startedAt,
			endedAt,
			error: terminalOutcome.status === "ok" ? void 0 : terminalOutcome.error,
			stopReason,
			livenessState,
			...payload?.yielded === true || resultMeta?.yielded === true ? { yielded: true } : {},
			...terminalOutcome.timeoutPhase ? { timeoutPhase: terminalOutcome.timeoutPhase } : {},
			...terminalOutcome.providerStarted !== void 0 ? { providerStarted: terminalOutcome.providerStarted } : {},
			...terminalReply ? { terminalReply } : {}
		}
	};
}
function parseDedupeKey(key) {
	const separator = key.indexOf(":");
	if (separator === -1) return;
	const source = key.slice(0, separator);
	const runId = key.slice(separator + 1);
	if (source !== "agent" && source !== "chat" || !runId) return;
	return {
		runId,
		source
	};
}
function setGatewayDedupeEntry(params) {
	const existing = params.dedupe.get(params.key);
	const existingObservation = existing ? parseDedupeObservation(existing) : void 0;
	const incomingObservation = parseDedupeObservation(params.entry);
	const existingOutcome = existingObservation?.state === "terminal" ? terminalOutcomeFromSnapshot(existingObservation.snapshot) : void 0;
	const incomingOutcome = incomingObservation.state === "terminal" ? terminalOutcomeFromSnapshot(incomingObservation.snapshot) : void 0;
	if (existingOutcome && isStickyAgentRunTerminalOutcome(existingOutcome) && !(params.startNewAttempt && incomingObservation.state === "active") && (!incomingOutcome || mergeAgentRunTerminalOutcome(existingOutcome, incomingOutcome) === existingOutcome)) return;
	const entry = existing?.requestIdentity ? {
		...params.entry,
		requestIdentity: existing.requestIdentity
	} : params.entry;
	params.dedupe.set(params.key, entry);
	const key = parseDedupeKey(params.key);
	if (!key) return;
	if (incomingObservation.state === "active") {
		beginAgentJob(key.runId);
		return;
	}
	if (incomingObservation.state === "terminal") {
		const lifecycle = agentJobs.get(key.runId)?.snapshotsBySource.get("lifecycle");
		if (key.source === "chat" && incomingObservation.snapshot.status === "ok" && lifecycle?.status === "ok" && lifecycle.yielded === true) {
			incomingObservation.snapshot.yielded = true;
			incomingObservation.snapshot.livenessState = lifecycle.livenessState;
		}
		recordAgentRunSnapshot({
			...incomingObservation.snapshot,
			runId: key.runId,
			source: key.source,
			session: params.session ? { ...params.session } : void 0,
			recordedAt: params.entry.ts
		});
	}
}
function getFreshestDedupeSnapshot(snapshotsBySource) {
	const agent = snapshotsBySource.get("agent");
	const chat = snapshotsBySource.get("chat");
	if (agent && chat) return chat.recordedAt > agent.recordedAt ? mergeSnapshot(agent, chat) : mergeSnapshot(chat, agent);
	return agent ?? chat;
}
function getCanonicalAgentRunSnapshot(snapshotsBySource, source) {
	const dedupe = source ? snapshotsBySource.get(source) : getFreshestDedupeSnapshot(snapshotsBySource);
	if (source && !dedupe) return;
	const lifecycle = snapshotsBySource.get("lifecycle");
	if (!dedupe || !lifecycle) return dedupe ?? lifecycle;
	return dedupe.version > lifecycle.version ? mergeSnapshot(lifecycle, dedupe) : mergeSnapshot(dedupe, lifecycle);
}
function getAgentRunSnapshot(params) {
	pruneAgentRunCache();
	const job = agentJobs.get(params.runId);
	const snapshot = job ? getCanonicalAgentRunSnapshot(job.snapshotsBySource, params.source) : void 0;
	return snapshot && snapshot.version > params.afterVersion ? snapshot : void 0;
}
function addAgentRunWaiter(runId, waiter) {
	const waiters = agentRunWaiters.get(runId) ?? /* @__PURE__ */ new Set();
	waiters.add(waiter);
	agentRunWaiters.set(runId, waiters);
	return () => {
		waiters.delete(waiter);
		if (waiters.size === 0) {
			agentRunWaiters.delete(runId);
			const pendingError = pendingAgentRunErrors.get(runId);
			if (pendingError && !pendingError.timer) {
				pendingAgentRunErrors.delete(runId);
				recordAgentRunSnapshot(pendingError.snapshot, pendingError.snapshot.version);
			}
		}
	};
}
function selectedSnapshot(snapshot) {
	return {
		session: snapshot.session,
		status: snapshot.status,
		startedAt: snapshot.startedAt,
		endedAt: snapshot.endedAt,
		error: snapshot.error,
		stopReason: snapshot.stopReason,
		livenessState: snapshot.livenessState,
		yielded: snapshot.yielded,
		pendingError: snapshot.pendingError,
		timeoutPhase: snapshot.timeoutPhase,
		providerStarted: snapshot.providerStarted,
		...snapshot.terminalDelivery ? { terminalDelivery: snapshot.terminalDelivery } : {},
		terminalReceipt: snapshot.terminalReceipt,
		terminalReply: snapshot.terminalReply
	};
}
async function waitForAgentJob(params) {
	ensureAgentRunListener();
	const afterVersion = params.ignoreCachedSnapshot ? agentJobState.version : -1;
	const cached = getAgentRunSnapshot({
		runId: params.runId,
		source: params.source,
		afterVersion
	});
	if (cached) return selectedSnapshot(cached);
	const signal = getAsyncWorkSignal();
	if (params.timeoutMs <= 0 || signal?.aborted) return null;
	return await new Promise((resolve) => {
		let settled = false;
		let removeWaiter = () => {};
		const finish = (snapshot) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeoutHandle);
			signal?.removeEventListener("abort", onClose);
			removeWaiter();
			resolve(snapshot);
		};
		const onClose = () => finish(null);
		const onWake = (lifecycleReset = false) => {
			if (lifecycleReset) {
				finish({
					status: "timeout",
					timeoutPhase: "gateway_draining"
				});
				return;
			}
			const snapshot = getAgentRunSnapshot({
				runId: params.runId,
				source: params.source,
				afterVersion
			});
			if (snapshot) finish(selectedSnapshot(snapshot));
		};
		removeWaiter = addAgentRunWaiter(params.runId, onWake);
		const timeoutHandle = setSafeTimeout(() => {
			if (!params.source) {
				const pending = pendingAgentRunErrors.get(params.runId);
				const pendingError = pending?.snapshot;
				if (pendingError && pendingError.version > afterVersion) {
					finish(!pending.timer || isStickyAgentRunTerminalOutcome(terminalOutcomeFromSnapshot(pendingError)) ? selectedSnapshot(pendingError) : createPendingErrorTimeoutSnapshot(pendingError));
					return;
				}
				const pendingTimeout = pendingAgentRunTimeouts.get(params.runId)?.snapshot;
				if (pendingTimeout && pendingTimeout.version > afterVersion && terminalOutcomeFromSnapshot(pendingTimeout)?.reason === "hard_timeout") {
					finish(selectedSnapshot(pendingTimeout));
					return;
				}
			}
			finish(null);
		}, params.timeoutMs);
		timeoutHandle.unref?.();
		signal?.addEventListener("abort", onClose, { once: true });
		if (signal?.aborted) onClose();
		else onWake();
	});
}
ensureAgentRunListener();
//#endregion
export { waitForAgentJob as i, getAgentJobSession as n, setGatewayDedupeEntry as r, captureAgentJobSession as t };
