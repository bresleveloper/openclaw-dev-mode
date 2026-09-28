import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
import "./tool-policy-YDdaK0oX.mjs";
import { _ as registerAgentRunContext, b as releaseAgentRunContext, c as getAgentRunContext, l as getAgentRunContextOwnerStatus, r as claimAgentRunContext, u as getAgentRunContextOwnership } from "./agent-run-registry-DO6Dg2r0.mjs";
import { a as emitAgentEventForOwner, l as getAgentEventLifecycleGeneration, s as emitAgentEventIfCurrent } from "./agent-events-BOSJcayE.mjs";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-DiXxneBV.mjs";
import { s as isDefinitiveRunLifecycle } from "./agent-run-terminal-outcome-CgoAW2Q7.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { i as captureWorkerTurnFinishing } from "./placement-turn-claim-events-D2oaSWT4.mjs";
import { r as projectAgentToolActivity } from "./agent-activity-events-DJmgjmUx.mjs";
import { c as sanitizeToolResult, n as capLiveExecResult, s as sanitizeToolArgs } from "./embedded-agent-tool-results-Cn4G9Xfj.mjs";
import { t as createTrajectoryRuntimeRecorder } from "./runtime-CD4ixm5M.mjs";
import { t as resolveWorkerSessionTarget } from "./session-target-BTXy7wfu.mjs";
import { t as captureWorkerTurnLiveEventOwner } from "./worker-turn-run-owner-B7IZPd2l.mjs";
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
	return createTrajectoryRuntimeRecorder({
		runId: params.runId,
		sessionId: params.target.sessionId,
		sessionKey: params.target.sessionKey,
		sessionTarget: {
			agentId: params.target.agentId ?? "main",
			sessionId: params.target.sessionId,
			sessionKey: params.target.sessionKey,
			storePath: params.target.storePath
		}
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
		else if (event.payload.phase === "fallback_step") recorder.recordEvent("model.fallback_step", prepareWorkerLiveEventData(event));
		else if (event.payload.phase === "finishing") recorder.recordEvent("model.finishing", prepareWorkerLiveEventData(event));
		else if ((event.payload.phase === "end" || event.payload.phase === "error") && isDefinitiveWorkerTerminalEvent(event)) {
			const data = prepareWorkerLiveEventData(event);
			const failed = event.payload.phase === "error";
			const interrupted = event.payload.aborted === true;
			recorder.recordEvent("model.completed", {
				...data,
				...failed ? { promptError: event.payload.error } : {}
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
//#region src/gateway/worker-environments/live-event-session-binding.ts
function isValidLiveSessionBinding(binding) {
	return binding.environmentId.length > 0 && binding.sessionId.length > 0 && Number.isSafeInteger(binding.runEpoch) && binding.runEpoch >= 0;
}
function prepareBoundLiveSessionSafely(config, binding) {
	try {
		if (!isValidLiveSessionBinding(binding)) return;
		const target = resolveWorkerSessionTarget(config, binding.sessionId);
		return target ? {
			...binding,
			target: {
				...target.agentId ? { agentId: target.agentId } : {},
				sessionId: target.sessionId,
				sessionKey: target.sessionKey,
				storePath: target.storePath
			}
		} : void 0;
	} catch {
		return;
	}
}
function matchesSessionIdentityMutation(binding, prepared, mutation) {
	return ("current" in mutation ? [mutation.previous, mutation.current] : [mutation.previous]).some((target) => target.sessionId === binding.sessionId || (prepared ? target.sessionKeys.includes(prepared.target.sessionKey) : false));
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
function createWorkerLiveEventReceiver(options) {
	const boundSessions = /* @__PURE__ */ new Map();
	const sessionBindings = /* @__PURE__ */ new Map();
	const fencedEnvironmentEpochs = /* @__PURE__ */ new Map();
	const staleSessions = /* @__PURE__ */ new Set();
	const windows = /* @__PURE__ */ new Map();
	const startupBindingOwners = new Map(options.startupBindings.filter(isValidLiveSessionBinding).map(({ environmentId, runEpoch }) => [environmentId, runEpoch]));
	const startupOwners = new Map([...options.startupOwners].filter(([environmentId, ownerEpoch]) => environmentId.length > 0 && Number.isSafeInteger(ownerEpoch) && ownerEpoch >= 0 && startupBindingOwners.get(environmentId) === ownerEpoch));
	const windowSize = Math.max(1, Math.floor(options.windowSize ?? DEFAULT_WINDOW_SIZE));
	const maxActiveRuns = Math.max(1, Math.floor(options.maxActiveRuns ?? DEFAULT_MAX_ACTIVE_RUNS));
	const maxPendingBytes = Math.max(1, Math.floor(options.maxPendingBytes ?? DEFAULT_MAX_PENDING_BYTES));
	const maxSessions = Math.max(1, Math.floor(options.maxSessions ?? DEFAULT_MAX_SESSIONS));
	let committedConfig = options.getConfig();
	for (const binding of options.startupBindings) {
		if (!isValidLiveSessionBinding(binding)) continue;
		const existing = sessionBindings.get(binding.sessionId);
		if (!existing || binding.runEpoch > existing.runEpoch || binding.runEpoch === existing.runEpoch && binding.environmentId === existing.environmentId) sessionBindings.set(binding.sessionId, { ...binding });
	}
	for (const binding of sessionBindings.values()) {
		const prepared = prepareBoundLiveSessionSafely(committedConfig, binding);
		if (prepared) boundSessions.set(binding.sessionId, prepared);
		else staleSessions.add(binding.sessionId);
	}
	const rotateCredential = (rotation) => rotateWorkerLiveEventCredential(windows.get(rotation.sessionId), rotation);
	const clearWindow = (window) => {
		windows.delete(window.sessionId);
		for (const runId of window.activeRuns.keys()) releaseWorkerLiveRun(window, runId);
		window.pending.clear();
		window.pendingBytes = 0;
		window.terminalRuns.clear();
	};
	const bindSessionWithConfig = (binding, config) => {
		if (!isValidLiveSessionBinding(binding)) return false;
		const existing = sessionBindings.get(binding.sessionId);
		if (existing && binding.runEpoch < existing.runEpoch || existing && binding.runEpoch === existing.runEpoch && binding.environmentId !== existing.environmentId) return false;
		const prepared = prepareBoundLiveSessionSafely(config, binding);
		if (!prepared) {
			if (existing?.environmentId === binding.environmentId && existing.runEpoch === binding.runEpoch) staleSessions.add(binding.sessionId);
			return false;
		}
		const window = windows.get(binding.sessionId);
		if (window && (window.environmentId !== binding.environmentId || window.runEpoch !== binding.runEpoch)) clearWindow(window);
		sessionBindings.set(binding.sessionId, { ...binding });
		boundSessions.set(binding.sessionId, prepared);
		staleSessions.delete(binding.sessionId);
		const retainedWindow = windows.get(binding.sessionId);
		if (retainedWindow) {
			retainedWindow.target = prepared.target;
			for (const [runId, owned] of retainedWindow.activeRuns) if (getAgentRunContextOwnerStatus(runId, owned.claimId, owned.lifecycleGeneration) === "active") registerAgentRunContext(runId, {
				...prepared.target.agentId ? { agentId: prepared.target.agentId } : {},
				isControlUiVisible: owned.controlUiVisible,
				lifecycleGeneration: owned.lifecycleGeneration,
				projectSessionActive: true,
				sessionId: binding.sessionId,
				sessionKey: prepared.target.sessionKey
			}, owned.claimId);
		}
		return true;
	};
	const bindSession = (binding) => bindSessionWithConfig(binding, committedConfig);
	const rebindAll = (config) => {
		committedConfig = config;
		for (const binding of sessionBindings.values()) bindSessionWithConfig(binding, committedConfig);
	};
	let unsubscribeSessionIdentityMutation;
	const start = () => {
		if (unsubscribeSessionIdentityMutation) return;
		unsubscribeSessionIdentityMutation = onSessionIdentityMutation((mutation) => {
			for (const binding of sessionBindings.values()) if (matchesSessionIdentityMutation(binding, boundSessions.get(binding.sessionId), mutation)) {
				if (!bindSessionWithConfig(binding, committedConfig)) {
					startupOwners.delete(binding.environmentId);
					const window = windows.get(binding.sessionId);
					if (window) clearWindow(window);
				}
			}
		});
		for (const binding of sessionBindings.values()) if (!bindSessionWithConfig(binding, committedConfig)) startupOwners.delete(binding.environmentId);
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
		const binding = boundSessions.get(sessionId);
		if (!binding) return {
			ok: false,
			details: { reason: "session-not-attached" }
		};
		if (binding.environmentId !== params.identity.environmentId || binding.runEpoch !== params.request.runEpoch) return {
			ok: false,
			details: { reason: "epoch-mismatch" }
		};
		if (staleSessions.has(sessionId)) return {
			ok: false,
			details: { reason: "session-not-attached" }
		};
		let window = windows.get(sessionId);
		if (window) {
			if (params.request.runEpoch !== window.runEpoch || params.identity.credentialHash !== window.credentialHash || params.identity.environmentId !== window.environmentId) return {
				ok: false,
				details: { reason: "epoch-mismatch" }
			};
		} else {
			if (startupOwners.get(params.identity.environmentId) !== params.request.runEpoch && params.request.lastAckedSeq !== 0) return resyncRequired(0);
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
				ackedSeq: params.request.lastAckedSeq,
				credentialHash: params.identity.credentialHash,
				environmentId: params.identity.environmentId,
				pending: /* @__PURE__ */ new Map(),
				pendingBytes: 0,
				trajectoryWrites: /* @__PURE__ */ new Set(),
				runEpoch: params.request.runEpoch,
				sessionId,
				target: binding.target,
				terminalRuns: /* @__PURE__ */ new Map()
			};
			windows.set(sessionId, window);
			startupOwners.delete(params.identity.environmentId);
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
			if (ownerStatus !== "active" || context?.sessionId !== window.sessionId || context.sessionKey !== window.target.sessionKey || context.agentId !== window.target.agentId || context.lifecycleGeneration !== owned.lifecycleGeneration || context.isControlUiVisible !== owned.controlUiVisible) {
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
		if (existingContext && (existingContext.sessionId !== window.sessionId || existingContext.sessionKey !== window.target.sessionKey || existingContext.agentId !== void 0 && existingContext.agentId !== window.target.agentId || existingContext.lifecycleGeneration !== lifecycleGeneration)) return invalidEvent();
		const hasExistingTrackedOwner = getAgentRunContextOwnership(runId)?.lifecycleGeneration === lifecycleGeneration;
		const emissionMode = existingContext ? "shared" : "exclusive";
		const claimId = claimAgentRunContext(runId, {
			...window.target.agentId ? { agentId: window.target.agentId } : {},
			isControlUiVisible: controlUiVisible,
			lifecycleGeneration,
			projectSessionActive: true,
			sessionId: window.sessionId,
			sessionKey: window.target.sessionKey
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
				target: window.target
			}),
			toolArgsByCallId: /* @__PURE__ */ new Map()
		};
		window.activeRuns.set(runId, claimed);
		return claimed;
	};
	const publish = (window, request, allowBufferedTerminalCapacity, recordApplied, runOwner) => {
		if (runOwner?.isCancelled()) {
			if (request.event.kind !== "lifecycle" || request.event.payload.phase !== "finishing" || request.event.payload.aborted !== true) return invalidEvent();
			window.terminalRuns.set(request.runId, request.seq);
			releaseWorkerLiveRun(window, request.runId);
			return;
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
		const ownsPublication = () => window.activeRuns.get(request.runId) === owned && getAgentRunContextOwnerStatus(request.runId, owned.claimId, owned.lifecycleGeneration) === "active";
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
	const drain = (window, first, firstApplied, firstOwner, firstPending) => {
		let request = first;
		let buffered = firstPending;
		let recordApplied = firstPending ? firstPending.recordApplied : firstApplied;
		let runOwner = firstPending ? firstPending.runOwner : firstOwner;
		let publishedPrefix = false;
		while (request) {
			const failed = publish(window, request, buffered !== void 0, recordApplied, runOwner);
			if (failed) {
				if (failed.details.reason === "capacity-exceeded" && buffered) return {
					ok: true,
					result: { ackedSeq: window.ackedSeq }
				};
				if (buffered) {
					if (window.pending.delete(request.seq)) window.pendingBytes -= buffered.sizeBytes;
				}
				if (failed.details.reason === "capacity-exceeded" && !publishedPrefix) {
					clearWindow(window);
					return failed;
				}
				return publishedPrefix ? {
					ok: true,
					result: { ackedSeq: window.ackedSeq }
				} : failed;
			}
			if (buffered) {
				if (window.pending.delete(request.seq)) window.pendingBytes -= buffered.sizeBytes;
			}
			window.ackedSeq = request.seq;
			publishedPrefix = true;
			const oldestRetainedSeq = window.ackedSeq - windowSize;
			for (const [runId, terminalSeq] of window.terminalRuns) if (!window.activeRuns.has(runId) && terminalSeq <= oldestRetainedSeq) window.terminalRuns.delete(runId);
			const next = window.pending.get(window.ackedSeq + 1);
			if (!next) break;
			request = next.request;
			buffered = next;
			recordApplied = next.recordApplied;
			runOwner = next.runOwner;
		}
		return {
			ok: true,
			result: { ackedSeq: window.ackedSeq }
		};
	};
	const applyToWindow = (window, params) => {
		if (params.request.seq <= window.ackedSeq) return {
			ok: true,
			result: { ackedSeq: window.ackedSeq }
		};
		if (params.request.lastAckedSeq > window.ackedSeq) return resyncWindow(window);
		const runOwner = captureWorkerTurnLiveEventOwner(params.identity);
		const recordFinishing = captureWorkerTurnFinishing(params.identity, params.request);
		const recordApplied = (event) => {
			runOwner?.record(event);
			recordFinishing?.();
		};
		const { seq } = params.request;
		const expectedSeq = window.ackedSeq + 1;
		if (seq > window.ackedSeq + windowSize) return resyncWindow(window);
		if (seq === expectedSeq) {
			const pending = window.pending.get(seq);
			return drain(window, pending?.request ?? params.request, recordApplied, runOwner, pending);
		}
		if (window.pending.has(seq)) return {
			ok: true,
			result: { ackedSeq: window.ackedSeq }
		};
		const sizeBytes = Buffer.byteLength(JSON.stringify(params.request.event), "utf8");
		if (window.pendingBytes + sizeBytes > maxPendingBytes) return resyncWindow(window);
		window.pending.set(seq, {
			request: params.request,
			sizeBytes,
			recordApplied,
			runOwner
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
		window.activeApplications += 1;
		try {
			let result;
			try {
				result = applyToWindow(window, params);
			} finally {
				await Promise.all(window.trajectoryWrites);
			}
			if (result.ok) {
				if (windows.get(sessionId) !== window || staleSessions.has(sessionId)) return {
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
	const clearEnvironment = (environmentId) => {
		startupOwners.delete(environmentId);
		let fencedEpoch = fencedEnvironmentEpochs.get(environmentId) ?? -1;
		for (const [sessionId, binding] of sessionBindings) if (binding.environmentId === environmentId) {
			fencedEpoch = Math.max(fencedEpoch, binding.runEpoch);
			sessionBindings.delete(sessionId);
			boundSessions.delete(sessionId);
			staleSessions.delete(sessionId);
		}
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
		unsubscribeSessionIdentityMutation?.();
		unsubscribeSessionIdentityMutation = void 0;
		for (const window of windows.values()) clearWindow(window);
		boundSessions.clear();
		sessionBindings.clear();
		fencedEnvironmentEpochs.clear();
		staleSessions.clear();
		startupOwners.clear();
	};
	return {
		apply,
		bindSession,
		clear,
		clearEnvironment,
		rebindAll,
		rotateCredential,
		start
	};
}
//#endregion
export { createWorkerLiveEventReceiver };
