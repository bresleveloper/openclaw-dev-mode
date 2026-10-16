import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-DWHChhWM.mjs";
import "./tool-policy-BKvvmcQR.mjs";
import { N as getAgentRunContextOwnerStatus, S as releaseAgentRunContext, l as getAgentRunContext, r as claimAgentRunContext, u as getAgentRunContextOwnership } from "./agent-run-registry-BaxMDLZF.mjs";
import { a as emitAgentEventForOwner, l as getAgentEventLifecycleGeneration, s as emitAgentEventIfCurrent } from "./agent-events-GvNTkbe3.mjs";
import { s as isDefinitiveRunLifecycle } from "./agent-run-terminal-outcome-Ccvy5spR.mjs";
import "./agent-run-terminal-outcome-BTCs8JFs.mjs";
import { a as captureWorkerReplyMedia, s as captureWorkerTurnFinishing } from "./placement-turn-claim-events-BCSz3C5d.mjs";
import { r as projectAgentToolActivity } from "./agent-activity-events-CYq4KNEY.mjs";
import { d as sanitizeToolResult, n as capLiveExecResult, u as sanitizeToolArgs } from "./embedded-agent-tool-results-C0yTOgai.mjs";
import { t as createTrajectoryRuntimeRecorder } from "./runtime-DZI7lQpT.mjs";
import { t as captureWorkerTurnLiveEventOwner } from "./worker-turn-run-owner-COMAoefy.mjs";
import { Buffer } from "node:buffer";
//#region src/gateway/worker-environments/live-event-projection.ts
function prepareWorkerLiveEventData(event) {
	const payload = structuredClone(event.payload);
	if (event.kind !== "tool") return payload;
	const toolName = normalizeToolPolicyName(event.payload.name);
	payload.name = toolName;
	if (event.payload.phase === "start") payload.args = sanitizeToolArgs(event.payload.args);
	else if (event.payload.phase === "update") {
		const partialResult = sanitizeToolResult(event.payload.partialResult);
		payload.partialResult = toolName === "exec" ? capLiveExecResult(partialResult) : partialResult;
	} else {
		const result = sanitizeToolResult(event.payload.result);
		payload.result = toolName === "exec" ? capLiveExecResult(result) : result;
	}
	return payload;
}
function isDefinitiveWorkerTerminalEvent(event) {
	return event.kind === "lifecycle" && isDefinitiveRunLifecycle({
		phase: event.payload.phase,
		data: event.payload
	});
}
function createWorkerLiveTrajectoryRecorder(params) {
	const target = params.source.sessionTarget;
	return createTrajectoryRuntimeRecorder({
		runId: params.runId,
		sessionId: target.sessionId,
		sessionKey: target.sessionKey,
		sessionTarget: target,
		assertCommitAllowed: params.source.receiptAuthority
	});
}
function recordWorkerLiveTrajectoryEvent(recorder, event) {
	if (!recorder) return;
	if (event.kind === "tool") {
		if (event.payload.phase === "start") recorder.recordEvent("tool.call", prepareWorkerLiveEventData(event));
		else if (event.payload.phase === "result") recorder.recordEvent("tool.result", {
			...prepareWorkerLiveEventData(event),
			success: !event.payload.isError
		});
		else return;
	} else if (event.kind === "approval") recorder.recordEvent(`approval.${event.payload.phase}`, prepareWorkerLiveEventData(event));
	else if (event.kind === "lifecycle") {
		if (event.payload.phase === "start") recorder.recordEvent("session.started", {
			...prepareWorkerLiveEventData(event),
			backend: "cloud-worker"
		});
		else if (event.payload.phase === "fallback_step" || event.payload.phase === "finishing") recorder.recordEvent(`model.${event.payload.phase}`, prepareWorkerLiveEventData(event));
		else if ((event.payload.phase === "end" || event.payload.phase === "error") && isDefinitiveWorkerTerminalEvent(event)) {
			const data = prepareWorkerLiveEventData(event);
			const failed = event.payload.phase === "error";
			const interrupted = event.payload.aborted === true;
			recorder.recordEvent("model.completed", {
				...data,
				...event.payload.phase === "error" ? { promptError: event.payload.error } : {}
			});
			recorder.recordEvent("session.ended", {
				...data,
				status: interrupted ? "interrupted" : failed ? "error" : "success"
			});
		} else return;
	} else return;
	return recorder.flush().catch(() => void 0);
}
//#endregion
//#region src/gateway/worker-environments/live-event-window.ts
function releaseWorkerLiveRun(window, runId) {
	const owned = window.activeRuns.get(runId);
	if (!owned) return;
	window.activeRuns.delete(runId);
	releaseAgentRunContext(runId, owned.claimId);
}
function fenceReleasedWorkerLiveRun(window, runId) {
	if (!window.terminalRuns.has(runId)) window.terminalRuns.set(runId, window.ackedSeq);
	releaseWorkerLiveRun(window, runId);
}
function hasReachableBufferedTerminal(window, admittedRunId, countedRunIds, windowSize) {
	for (let seq = window.ackedSeq + 2; seq <= window.ackedSeq + windowSize; seq += 1) {
		const pending = window.pending.get(seq);
		if (!pending) return false;
		const pendingRunId = pending.request.runId;
		if (countedRunIds.has(pendingRunId)) {
			if (isDefinitiveWorkerTerminalEvent(pending.request.event)) return true;
			continue;
		}
		if (pendingRunId !== admittedRunId) return false;
	}
	return false;
}
function rotateWorkerLiveEventCredential(window, rotation) {
	if (!rotation.credentialHash || !rotation.environmentId || !rotation.previousCredentialHash || !rotation.sessionId || !Number.isSafeInteger(rotation.runEpoch) || rotation.runEpoch < 0) return false;
	if (window?.credentialHash === rotation.previousCredentialHash && window.environmentId === rotation.environmentId && window.runEpoch === rotation.runEpoch) {
		if (rotation.newProcessTurn === true) {
			if (!Number.isSafeInteger(rotation.ackedSeq) || rotation.ackedSeq < 0 || rotation.ackedSeq > window.ackedSeq) return false;
			for (const [runId, owned] of window.activeRuns) releaseAgentRunContext(runId, owned.claimId);
			window.activeRuns.clear();
			window.ackedSeq = rotation.ackedSeq;
			window.pending.clear();
			window.pendingBytes = 0;
			window.terminalRuns.clear();
		}
		window.credentialHash = rotation.credentialHash;
		return true;
	}
	return false;
}
//#endregion
//#region src/gateway/worker-environments/live-events.ts
const DEFAULT_WINDOW_SIZE = 128;
const DEFAULT_MAX_PENDING_BYTES = 524288;
const DEFAULT_MAX_SESSIONS = 128;
const DEFAULT_MAX_ACTIVE_RUNS = 32;
const MAX_FENCED_ENVIRONMENTS = 4096;
function invalidEvent() {
	return {
		ok: false,
		details: { reason: "invalid-event" }
	};
}
function capacityExceeded() {
	return {
		ok: false,
		details: { reason: "capacity-exceeded" }
	};
}
function createWorkerLiveEventReceiver(options = {}) {
	const fencedEnvironmentEpochs = /* @__PURE__ */ new Map();
	const windows = /* @__PURE__ */ new Map();
	const windowSize = Math.max(1, Math.floor(options.windowSize ?? DEFAULT_WINDOW_SIZE));
	const maxActiveRuns = Math.max(1, Math.floor(options.maxActiveRuns ?? DEFAULT_MAX_ACTIVE_RUNS));
	const maxPendingBytes = Math.max(1, Math.floor(options.maxPendingBytes ?? DEFAULT_MAX_PENDING_BYTES));
	const maxSessions = Math.max(1, Math.floor(options.maxSessions ?? DEFAULT_MAX_SESSIONS));
	const rotateCredential = (rotation) => rotateWorkerLiveEventCredential(windows.get(rotation.sessionId), rotation);
	const clearWindow = (window) => {
		windows.delete(window.sessionId);
		for (const runId of window.activeRuns.keys()) releaseWorkerLiveRun(window, runId);
		window.pending.clear();
		window.pendingBytes = 0;
		window.terminalRuns.clear();
	};
	const resyncRequired = (ackedSeq) => ({
		ok: false,
		details: {
			reason: "resync-required",
			ackedSeq,
			expectedSeq: ackedSeq + 1
		}
	});
	const resyncWindow = (window) => {
		window.pending.clear();
		window.pendingBytes = 0;
		return resyncRequired(window.ackedSeq);
	};
	const resolveOrCreateWindow = (sessionId, params) => {
		let window = windows.get(sessionId);
		if (window && (window.environmentId !== params.identity.environmentId || window.runEpoch !== params.request.runEpoch)) {
			if (params.request.runEpoch <= window.runEpoch) return {
				ok: false,
				details: { reason: "epoch-mismatch" }
			};
			clearWindow(window);
			window = void 0;
		}
		if (window) {
			if (params.identity.credentialHash !== window.credentialHash) return {
				ok: false,
				details: { reason: "epoch-mismatch" }
			};
		} else {
			const ackedSeq = params.readAckedSeq();
			if (params.request.lastAckedSeq > ackedSeq) return resyncRequired(ackedSeq);
			if (windows.size >= maxSessions) {
				let evicted = false;
				for (const candidate of windows.values()) if (!(candidate.activeApplications > 0 || [...candidate.activeRuns.entries()].some(([runId, owned]) => getAgentRunContextOwnerStatus(runId, owned.claimId, owned.lifecycleGeneration) === "active"))) {
					clearWindow(candidate);
					evicted = true;
					break;
				}
				if (!evicted) return capacityExceeded();
			}
			window = {
				activeApplications: 0,
				activeRuns: /* @__PURE__ */ new Map(),
				ackedSeq,
				credentialHash: params.identity.credentialHash,
				environmentId: params.identity.environmentId,
				pending: /* @__PURE__ */ new Map(),
				pendingBytes: 0,
				trajectoryWrites: /* @__PURE__ */ new Set(),
				runEpoch: params.request.runEpoch,
				sessionId,
				source: params.source,
				terminalRuns: /* @__PURE__ */ new Map()
			};
			windows.set(sessionId, window);
		}
		if (window.source !== params.source) {
			if (window.activeRuns.size > 0 || window.pending.size > 0 || window.activeApplications > 0) return invalidEvent();
			window.source = params.source;
		}
		return window;
	};
	const pruneReleasedRuns = (window) => {
		for (const [runId, owned] of window.activeRuns) {
			const ownerStatus = getAgentRunContextOwnerStatus(runId, owned.claimId, owned.lifecycleGeneration);
			if (ownerStatus === void 0) {
				clearWindow(window);
				return resyncRequired(0);
			}
			if (ownerStatus !== "active") fenceReleasedWorkerLiveRun(window, runId);
		}
	};
	const claimRun = (window, runId, allowBufferedTerminalCapacity) => {
		if (window.terminalRuns.has(runId)) return invalidEvent();
		const owned = window.activeRuns.get(runId);
		if (owned) {
			const context = getAgentRunContext(runId);
			const ownerStatus = getAgentRunContextOwnerStatus(runId, owned.claimId, owned.lifecycleGeneration);
			if (ownerStatus === void 0) {
				clearWindow(window);
				return resyncRequired(0);
			}
			if (ownerStatus !== "active" || context?.sessionId !== window.sessionId || context.sessionKey !== window.source.sessionTarget.sessionKey || context.agentId !== window.source.sessionTarget.agentId || context.lifecycleGeneration !== owned.lifecycleGeneration || context.isControlUiVisible !== owned.controlUiVisible) {
				fenceReleasedWorkerLiveRun(window, runId);
				return invalidEvent();
			}
			return owned;
		}
		const pruneFailure = pruneReleasedRuns(window);
		if (pruneFailure) return pruneFailure;
		const countedRunIds = /* @__PURE__ */ new Set();
		for (const activeRunId of window.activeRuns.keys()) if (!window.terminalRuns.has(activeRunId)) countedRunIds.add(activeRunId);
		if (countedRunIds.size >= maxActiveRuns && !(allowBufferedTerminalCapacity && hasReachableBufferedTerminal(window, runId, countedRunIds, windowSize))) return capacityExceeded();
		const lifecycleGeneration = getAgentEventLifecycleGeneration();
		const existingContext = getAgentRunContext(runId);
		const controlUiVisible = existingContext?.isControlUiVisible ?? false;
		if (existingContext && (existingContext.sessionId !== window.sessionId || existingContext.sessionKey !== window.source.sessionTarget.sessionKey || existingContext.agentId !== void 0 && existingContext.agentId !== window.source.sessionTarget.agentId || existingContext.lifecycleGeneration !== lifecycleGeneration)) return invalidEvent();
		const hasExistingTrackedOwner = getAgentRunContextOwnership(runId)?.lifecycleGeneration === lifecycleGeneration;
		const emissionMode = existingContext ? "shared" : "exclusive";
		const claimId = claimAgentRunContext(runId, {
			...window.source.sessionTarget.agentId ? { agentId: window.source.sessionTarget.agentId } : {},
			isControlUiVisible: controlUiVisible,
			lifecycleGeneration,
			projectSessionActive: true,
			sessionId: window.sessionId,
			sessionKey: window.source.sessionTarget.sessionKey
		}, {
			exclusive: existingContext === void 0,
			onClearRequested: (clearedClaimId) => {
				if (window.activeRuns.get(runId)?.claimId === clearedClaimId) fenceReleasedWorkerLiveRun(window, runId);
			},
			ownsContext: !hasExistingTrackedOwner,
			trackOwner: true
		});
		if (!claimId) return invalidEvent();
		const claimed = {
			claimId,
			controlUiVisible,
			emissionMode,
			lifecycleGeneration,
			trajectoryRecorder: createWorkerLiveTrajectoryRecorder({
				runId,
				source: window.source
			}),
			toolArgsByCallId: /* @__PURE__ */ new Map()
		};
		window.activeRuns.set(runId, claimed);
		return claimed;
	};
	const publish = async (window, publication, allowBufferedTerminalCapacity) => {
		const { request, recordApplied, runOwner, source, prepareReplyMedia } = publication;
		if (runOwner?.isCancelled()) {
			if (!runOwner.isCancelledFinishing(request)) return invalidEvent();
			window.terminalRuns.set(request.runId, request.seq);
			releaseWorkerLiveRun(window, request.runId);
			return;
		}
		try {
			source.receiptAuthority();
		} catch {
			return invalidEvent();
		}
		const owned = claimRun(window, request.runId, allowBufferedTerminalCapacity);
		if ("ok" in owned) return owned;
		const definitiveTerminal = isDefinitiveWorkerTerminalEvent(request.event);
		if (definitiveTerminal) window.terminalRuns.set(request.runId, request.seq);
		const event = {
			runId: request.runId,
			stream: request.event.kind,
			data: prepareWorkerLiveEventData(request.event)
		};
		if (request.event.kind === "assistant" && request.event.payload.mediaUrls?.length && prepareReplyMedia) {
			const payload = await prepareReplyMedia(request.event.payload);
			event.data = {
				...event.data,
				...payload
			};
			if (payload.text !== request.event.payload.text) {
				event.data.replace = true;
				event.data.delta = payload.text ?? "";
			}
		}
		let activity;
		if (request.event.kind === "tool") {
			const tool = request.event.payload;
			if (tool.phase === "start") owned.toolArgsByCallId.set(tool.toolCallId, tool.args);
			activity = projectAgentToolActivity({
				...tool,
				name: normalizeToolPolicyName(tool.name),
				args: owned.toolArgsByCallId.get(tool.toolCallId)
			});
			if (tool.phase === "result") owned.toolArgsByCallId.delete(tool.toolCallId);
		}
		const itemEvent = activity ? {
			runId: request.runId,
			stream: "item",
			data: activity
		} : void 0;
		const emissions = itemEvent ? activity?.phase === "start" ? [itemEvent, event] : [event, itemEvent] : [event];
		const ownsPublication = () => {
			try {
				source.receiptAuthority();
			} catch {
				return false;
			}
			return window.activeRuns.get(request.runId) === owned && getAgentRunContextOwnerStatus(request.runId, owned.claimId, owned.lifecycleGeneration) === "active";
		};
		for (const emission of emissions) {
			if (!ownsPublication()) return invalidEvent();
			if (owned.emissionMode === "shared") {
				if (!emitAgentEventIfCurrent(emission)) {
					if (definitiveTerminal) window.terminalRuns.delete(request.runId);
					return invalidEvent();
				}
			} else emitAgentEventForOwner(emission, owned.claimId);
		}
		if (activity && !ownsPublication()) return invalidEvent();
		const write = recordWorkerLiveTrajectoryEvent(owned.trajectoryRecorder, request.event);
		if (write) {
			window.trajectoryWrites.add(write);
			write.then(() => window.trajectoryWrites.delete(write));
		}
		recordApplied?.(request.event);
	};
	const drain = async (window, first, firstPending) => {
		let buffered = firstPending;
		let publishedPrefix = false;
		while (true) {
			const publication = buffered ?? first;
			const { request } = publication;
			const failed = await publish(window, publication, buffered !== void 0);
			if (failed?.details.reason === "capacity-exceeded" && buffered) return {
				ok: true,
				result: { ackedSeq: window.ackedSeq }
			};
			if (buffered && window.pending.delete(request.seq)) window.pendingBytes -= buffered.sizeBytes;
			if (failed) {
				if (failed.details.reason === "capacity-exceeded" && !publishedPrefix) {
					clearWindow(window);
					return failed;
				}
				return publishedPrefix ? {
					ok: true,
					result: { ackedSeq: window.ackedSeq }
				} : failed;
			}
			window.ackedSeq = request.seq;
			publishedPrefix = true;
			const oldestRetainedSeq = window.ackedSeq - windowSize;
			for (const [runId, terminalSeq] of window.terminalRuns) if (!window.activeRuns.has(runId) && terminalSeq <= oldestRetainedSeq) window.terminalRuns.delete(runId);
			buffered = window.pending.get(window.ackedSeq + 1);
			if (!buffered) break;
		}
		return {
			ok: true,
			result: { ackedSeq: window.ackedSeq }
		};
	};
	const applyToWindow = async (window, params, runOwner) => {
		if (params.request.seq <= window.ackedSeq) return {
			ok: true,
			result: { ackedSeq: window.ackedSeq }
		};
		if (params.request.lastAckedSeq > window.ackedSeq) return resyncWindow(window);
		const recordFinishing = captureWorkerTurnFinishing(params.identity, params.request);
		const recordApplied = (event) => {
			runOwner?.record(event);
			recordFinishing?.();
		};
		const publication = {
			request: params.request,
			recordApplied,
			runOwner,
			source: params.source,
			prepareReplyMedia: captureWorkerReplyMedia(params.identity)
		};
		const { seq } = params.request;
		const expectedSeq = window.ackedSeq + 1;
		if (seq > window.ackedSeq + windowSize) return resyncWindow(window);
		if (seq === expectedSeq) return drain(window, publication, window.pending.get(seq));
		if (window.pending.has(seq)) return {
			ok: true,
			result: { ackedSeq: window.ackedSeq }
		};
		const sizeBytes = Buffer.byteLength(JSON.stringify(params.request.event), "utf8");
		if (window.pendingBytes + sizeBytes > maxPendingBytes) return resyncWindow(window);
		window.pending.set(seq, {
			...publication,
			sizeBytes
		});
		window.pendingBytes += sizeBytes;
		return {
			ok: true,
			result: { ackedSeq: window.ackedSeq }
		};
	};
	const apply = async (params) => {
		if (!params.identity.sessionId) return {
			ok: false,
			details: { reason: "session-not-attached" }
		};
		if (params.request.runEpoch !== params.identity.ownerEpoch) return {
			ok: false,
			details: { reason: "epoch-mismatch" }
		};
		if (params.request.runEpoch <= (fencedEnvironmentEpochs.get(params.identity.environmentId) ?? -1)) return invalidEvent();
		const sessionId = params.identity.sessionId;
		const window = resolveOrCreateWindow(sessionId, params);
		if ("ok" in window) return window;
		const runOwner = captureWorkerTurnLiveEventOwner(params.identity);
		window.activeApplications += 1;
		try {
			let result;
			try {
				result = await applyToWindow(window, params, runOwner);
			} finally {
				await Promise.all(window.trajectoryWrites);
			}
			if (result.ok) {
				if (!runOwner?.isCancelledFinishing(params.request)) try {
					params.source.receiptAuthority();
				} catch {
					return invalidEvent();
				}
				if (windows.get(sessionId) !== window) return {
					ok: false,
					details: { reason: "session-not-attached" }
				};
				if (window.credentialHash !== params.identity.credentialHash) return {
					ok: false,
					details: { reason: "epoch-mismatch" }
				};
			}
			return result;
		} finally {
			window.activeApplications -= 1;
		}
	};
	const clearEnvironment = (environmentId, ownerEpoch) => {
		let fencedEpoch = Math.max(fencedEnvironmentEpochs.get(environmentId) ?? -1, ownerEpoch);
		for (const window of windows.values()) if (window.environmentId === environmentId) {
			fencedEpoch = Math.max(fencedEpoch, window.runEpoch);
			clearWindow(window);
		}
		if (fencedEpoch >= 0) {
			fencedEnvironmentEpochs.delete(environmentId);
			fencedEnvironmentEpochs.set(environmentId, fencedEpoch);
			pruneMapToMaxSize(fencedEnvironmentEpochs, MAX_FENCED_ENVIRONMENTS);
		}
	};
	const clear = () => {
		for (const window of windows.values()) clearWindow(window);
		fencedEnvironmentEpochs.clear();
	};
	return {
		apply,
		clear,
		clearEnvironment,
		rotateCredential
	};
}
//#endregion
export { createWorkerLiveEventReceiver };
