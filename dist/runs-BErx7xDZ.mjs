import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { c as getActiveAgentRunDelegatedAuthority, l as getAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
import { l as getAgentEventLifecycleGeneration, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-GvNTkbe3.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./io-CUI9EWW_.mjs";
import { a as loadSessionEntry, s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { n as createMessageInjectionAuthority } from "./message-injection-authority-CJuS3j6I.mjs";
import { G as isEmbeddedRunHandleAbortable, K as isEmbeddedRunHandleSupersedable, P as resolveReplyRunForCurrentSessionId, W as canSteerEmbeddedRunDuringCompaction, d as getAttachedBackend, f as hasCommittedReplyOperationOutcome, p as hasReplyOperationExecutionStarted, u as forceClearReplyOperation } from "./reply-run-registry.state-DhKeZ1Xr.mjs";
import { a as logMessageQueuedWithBacklogPolicy, t as diagnosticLogger } from "./diagnostic-runtime-Clvsorku.mjs";
import { n as QuestionAnswerUnconfirmedError } from "./gateway-question-dispatch-C_wwDFMf.mjs";
import { t as hasPromptImageInput } from "./prompt-image-input-EpP8AiM6.mjs";
import { _ as resolveActiveEmbeddedRunRecoveryBlocker, a as ACTIVE_EMBEDDED_RUNS_BY_RUN_ID, c as ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY, d as EMBEDDED_RUN_FORCED_TERMINAL_SETTLEMENTS, f as EMBEDDED_RUN_WAITERS, i as ACTIVE_EMBEDDED_RUNS, l as ACTIVE_EMBEDDED_RUN_SNAPSHOTS, n as ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE, o as ACTIVE_EMBEDDED_RUN_REGISTRATIONS, p as RETAINED_EMBEDDED_RUN_ABORTABILITY_RUN_IDS, r as ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY, s as ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE, t as ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID, u as EMBEDDED_RUN_COMPLETION_CLAIMS, v as setActiveEmbeddedRunLifecycleGeneration } from "./run-state-BmDkKYBf.mjs";
import { b as resolveRunStaleThresholdMs, f as markDiagnosticRunProgress, l as markDiagnosticEmbeddedRunEnded, o as getDiagnosticSessionActivitySnapshot, s as isDiagnosticEmbeddedRunOwnerClosed, u as markDiagnosticEmbeddedRunStarted } from "./diagnostic-run-activity-BlCpLag4.mjs";
import { S as waitForReplyRunEndBySessionId, _ as resolveActiveReplyRunSessionId, a as expireStaleReplyRunBySessionId, b as supersedeReplyRunByRunId, d as isReplyRunActiveForSessionId, f as isReplyRunEvidenceStaleBySessionId, k as resolveReplyBackendQueueMessageMismatch, n as abortReplyRunBySessionId, p as listActiveReplyRunSessionIds, t as abortActiveReplyRuns, u as isReplyRunAbortableForCompaction, x as waitForReplyOperationOwnerSettlement } from "./reply-run-registry.registry-CVpYrkbm.mjs";
import "./reply-run-registry-CHTPEb3-.mjs";
import { o as logSessionStateChange } from "./diagnostic-ozwVRTLX.mjs";
import { t as resolveSessionPlacementForcedTerminalSettlement } from "./session-placement-forced-terminal-settlement-DBDQheFW.mjs";
import { a as getGatewayToolCallerIdentity } from "./gateway-caller-context-DWr-fdGt.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/embedded-agent-runner/runs.ts
function createQueueFailureOutcome(sessionId, reason, errorMessage) {
	return {
		queued: false,
		sessionId,
		reason,
		gatewayHealth: "live",
		...errorMessage ? { errorMessage } : {}
	};
}
function formatEmbeddedAgentQueueFailureSummary(outcome) {
	if (outcome.queued) return;
	const errorPart = outcome.errorMessage ? ` error=${outcome.errorMessage}` : "";
	return `queue_message_failed reason=${outcome.reason} sessionId=${outcome.sessionId} gatewayHealth=${outcome.gatewayHealth}${errorPart}`;
}
function clearActiveRunSessionIndex(index, sessionId, key) {
	if (key) {
		if (index.get(key) === sessionId) index.delete(key);
		return;
	}
	for (const [entryKey, activeSessionId] of index) if (activeSessionId === sessionId) index.delete(entryKey);
}
function normalizeSessionFileRegistryKey(sessionFile) {
	const normalized = sessionFile?.trim();
	if (!normalized) return;
	if (normalized.startsWith("agent:") || normalized.startsWith("sqlite:") || normalized.startsWith("in-memory:")) return normalized;
	const resolved = path.resolve(normalized);
	const parent = path.dirname(resolved);
	try {
		return path.join(fs.realpathSync(parent), path.basename(resolved));
	} catch {
		return resolved;
	}
}
function clearEmbeddedRunAbandonmentBySessionId(sessionId) {
	const abandonedRun = ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID.get(sessionId);
	if (!abandonedRun) return;
	ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID.delete(sessionId);
	const normalizedSessionKey = abandonedRun.sessionKey?.trim();
	if (normalizedSessionKey && ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY.get(normalizedSessionKey) === sessionId) ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY.delete(normalizedSessionKey);
	const normalizedSessionFile = normalizeSessionFileRegistryKey(abandonedRun.sessionFile);
	if (normalizedSessionFile && ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE.get(normalizedSessionFile) === sessionId) ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE.delete(normalizedSessionFile);
}
function clearEmbeddedRunAbandonment(params) {
	const normalizedSessionId = params.sessionId?.trim();
	if (normalizedSessionId) clearEmbeddedRunAbandonmentBySessionId(normalizedSessionId);
	for (const [key, index] of [[params.sessionKey?.trim(), ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY], [normalizeSessionFileRegistryKey(params.sessionFile), ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE]]) {
		const sessionId = key ? index.get(key) : void 0;
		if (sessionId) clearEmbeddedRunAbandonmentBySessionId(sessionId);
	}
}
function markEmbeddedRunAbandoned(params) {
	const sessionId = params.sessionId.trim();
	if (!sessionId) return;
	clearEmbeddedRunAbandonment({
		sessionId,
		sessionKey: params.sessionKey,
		sessionFile: params.sessionFile
	});
	const normalizedSessionFile = normalizeSessionFileRegistryKey(params.sessionFile);
	const abandonedRun = {
		sessionId,
		...params.runId?.trim() ? { runId: params.runId.trim() } : {},
		abandonedAtMs: Date.now(),
		reason: params.reason,
		...params.sessionKey?.trim() ? { sessionKey: params.sessionKey.trim() } : {},
		...normalizedSessionFile ? { sessionFile: normalizedSessionFile } : {}
	};
	ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID.set(sessionId, abandonedRun);
	if (abandonedRun.sessionKey) ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY.set(abandonedRun.sessionKey, sessionId);
	if (abandonedRun.sessionFile) ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE.set(abandonedRun.sessionFile, sessionId);
}
function markActiveEmbeddedRunAbandoned(params) {
	const sessionId = params.sessionId.trim();
	if (!sessionId || ACTIVE_EMBEDDED_RUNS.get(sessionId) !== params.handle) return false;
	markEmbeddedRunAbandoned({
		...params,
		runId: params.handle.runId
	});
	return true;
}
function resolveEmbeddedRunAbandonment(params) {
	const normalizedSessionId = params.sessionId?.trim();
	const normalizedSessionKey = params.sessionKey?.trim();
	const normalizedSessionFile = normalizeSessionFileRegistryKey(params.sessionFile);
	const sessionIds = [
		normalizedSessionId,
		normalizedSessionKey ? ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY.get(normalizedSessionKey) : void 0,
		normalizedSessionFile ? ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE.get(normalizedSessionFile) : void 0
	];
	const reasons = new Set(sessionIds.map((sessionId) => sessionId ? ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID.get(sessionId)?.reason : void 0));
	return reasons.has("timeout") ? "timeout" : reasons.has("recovering_timeout") ? "recovering_timeout" : void 0;
}
/**
* Temporarily releases terminal-timeout delivery suppression while a timed-out
* attempt is performing an eligible compaction-and-retry recovery.
*/
function markEmbeddedRunRecoveringTimeout(params) {
	const abandoned = ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID.get(params.sessionId.trim());
	if (!abandoned || abandoned.reason !== "timeout" || abandoned.runId && abandoned.runId !== params.runId?.trim()) return;
	const recoveryToken = Symbol("openclaw.embeddedRunTimeoutRecovery");
	abandoned.reason = "recovering_timeout";
	abandoned.recoveryToken = recoveryToken;
	return {
		sessionId: abandoned.sessionId,
		recoveryToken
	};
}
/** Restores terminal-timeout suppression when recovery cannot continue. */
function restoreEmbeddedRunTimeoutAbandonment(marker) {
	const abandoned = ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID.get(marker.sessionId.trim());
	if (!abandoned || abandoned.reason !== "recovering_timeout" || abandoned.recoveryToken !== marker.recoveryToken) return false;
	abandoned.reason = "timeout";
	delete abandoned.recoveryToken;
	return true;
}
/**
* @deprecated Prefer queueEmbeddedAgentMessageWithOutcomeAsync when callers need to
* know whether steering was accepted. This sync helper is fire-and-forget after
* initial eligibility and only logs later runtime rejection.
*/
function queueEmbeddedAgentMessageWithOutcome(sessionId, text, options) {
	const prepared = prepareEmbeddedAgentQueueMessage(sessionId, options);
	if (prepared.kind === "complete") return prepared.outcome;
	logActiveRunMessageAccepted(sessionId);
	prepared.queueMessage(text, prepared.options).catch((err) => {
		const message = `queue message rejected after enqueue: sessionId=${sessionId} err=${formatErrorMessage(err)}`;
		if (err instanceof QuestionAnswerUnconfirmedError) diagnosticLogger.warn(message);
		else diagnosticLogger.debug(message);
	});
	return {
		queued: true,
		sessionId,
		target: "embedded_run",
		gatewayHealth: "live",
		enqueuedAtMs: Date.now()
	};
}
function logActiveRunMessageAccepted(sessionId) {
	logMessageQueuedWithBacklogPolicy({
		sessionId,
		source: "embedded-agent-runner"
	}, false);
}
function resolveEmbeddedInjection(sessionId, handle, sourceCanInject) {
	try {
		const guarded = handle.messageInjectionV2;
		if (guarded?.version === 2) {
			const registration = ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle);
			const operation = resolveReplyRunForCurrentSessionId(sessionId);
			const ownedOperation = operation && getAttachedBackend(operation) === handle ? operation : void 0;
			const assertCurrent = createMessageInjectionAuthority(() => {
				if (sourceCanInject && !sourceCanInject()) return false;
				registration?.toolAuthority?.assertActive();
				return ACTIVE_EMBEDDED_RUNS.get(sessionId) === handle && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) === registration && (!ownedOperation || resolveReplyRunForCurrentSessionId(sessionId) === ownedOperation && getAttachedBackend(ownedOperation) === handle);
			});
			const authorityKind = sourceCanInject ? "source-bound" : "run";
			return guarded.isAvailable() ? {
				queueMessage: (text, options) => guarded.queueMessage(text, options, assertCurrent, authorityKind),
				claimPendingUserInputAnswer: guarded.claimPendingUserInputAnswer ? (text, options) => guarded.claimPendingUserInputAnswer(text, options, assertCurrent, authorityKind) : void 0,
				cancelPendingUserInput: guarded.cancelPendingUserInput ? (resolvedBy) => guarded.cancelPendingUserInput(resolvedBy, assertCurrent, authorityKind) : void 0
			} : void 0;
		}
		if (sourceCanInject) return;
		const injection = handle.messageInjection;
		if (injection) return injection.isAvailable() ? {
			queueMessage: (text, options) => injection.queueMessage(text, options),
			claimPendingUserInputAnswer: handle.claimPendingUserInputAnswer?.bind(handle),
			cancelPendingUserInput: handle.cancelPendingUserInput?.bind(handle)
		} : void 0;
		return (handle.isStopped ? !handle.isStopped() : handle.isStreaming()) ? handle : void 0;
	} catch (err) {
		diagnosticLogger.warn(`queue message failed: sessionId=${sessionId} reason=injectable_check_failed err=${String(err)}`);
		return;
	}
}
function isEmbeddedAgentRunAbortableForRunId(runId) {
	const normalizedRunId = runId.trim();
	if (!normalizedRunId) return true;
	const handle = ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(normalizedRunId);
	return handle ? isEmbeddedRunHandleAbortable(normalizedRunId, handle) : true;
}
/** Cancels one exact process-local run after recording its superseded terminal owner. */
function supersedeEmbeddedAgentRunByRunId(runId, beforeCancel) {
	const normalizedRunId = runId.trim();
	if (!normalizedRunId) return false;
	const handle = ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(normalizedRunId);
	if (handle) {
		if (!isEmbeddedRunHandleSupersedable(normalizedRunId, handle)) return false;
		beforeCancel();
		if (handle.cancel) handle.cancel("superseded");
		else handle.abort();
		const registration = ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle);
		if (registration) notifyEmbeddedRunEnded(registration.sessionId, handle, true);
		return true;
	}
	return supersedeReplyRunByRunId(normalizedRunId, beforeCancel);
}
function clearEmbeddedAgentRunAbortabilityForRunId(runId) {
	const normalizedRunId = runId.trim();
	if (normalizedRunId) {
		ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.delete(normalizedRunId);
		RETAINED_EMBEDDED_RUN_ABORTABILITY_RUN_IDS.delete(normalizedRunId);
	}
}
function retainEmbeddedAgentRunAbortabilityForRunId(runId) {
	const normalizedRunId = runId.trim();
	if (normalizedRunId) RETAINED_EMBEDDED_RUN_ABORTABILITY_RUN_IDS.add(normalizedRunId);
}
function clearEmbeddedRunAbortability(handle, opts) {
	ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle)?.humanInputWaits?.clear();
	if (!handle.runId || ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(handle.runId) !== handle) return;
	if (opts?.retainFinalizing && RETAINED_EMBEDDED_RUN_ABORTABILITY_RUN_IDS.has(handle.runId) && !isEmbeddedRunHandleAbortable(handle.runId, handle)) return;
	ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.delete(handle.runId);
}
async function queueEmbeddedAgentMessageWithOutcomeAsync(sessionId, text, options) {
	return queueEmbeddedAgentMessageAsync(sessionId, text, options);
}
/** TUI preflight requires V2 ownership; failure leaves ordinary input to local queue policy. */
async function claimPendingEmbeddedAgentQuestionAnswer(sessionId, text) {
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	if (!handle?.runId?.trim() || handle.messageInjectionV2?.version !== 2) return null;
	const runId = handle.runId;
	const registration = ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle);
	const injection = resolveEmbeddedInjection(sessionId, handle);
	if (!injection?.claimPendingUserInputAnswer) return null;
	try {
		registration?.toolAuthority?.assertActive();
	} catch {
		return null;
	}
	if (ACTIVE_EMBEDDED_RUNS.get(sessionId) !== handle || ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) !== registration) return null;
	if (!await injection.claimPendingUserInputAnswer(text, { isInboundUserMessage: true })) return null;
	logActiveRunMessageAccepted(sessionId);
	return { runId };
}
/** Source-bound callers require an explicitly guarded backend, never a V1 fallback. */
async function queueGuardedEmbeddedAgentMessageWithOutcomeAsync(sessionId, text, options, canInject) {
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	const onQueueSettled = options?.onQueueSettled;
	if (!handle || !onQueueSettled) return queueEmbeddedAgentMessageAsync(sessionId, text, options, canInject);
	const waiters = EMBEDDED_RUN_WAITERS.get(sessionId) ?? /* @__PURE__ */ new Set();
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	const abortSignal = operation && getAttachedBackend(operation) === handle ? operation.abortSignal : void 0;
	let settled = false;
	const close = (notify) => {
		if (settled) return;
		settled = true;
		waiters.delete(waiter);
		if (waiters.size === 0 && EMBEDDED_RUN_WAITERS.get(sessionId) === waiters) EMBEDDED_RUN_WAITERS.delete(sessionId);
		abortSignal?.removeEventListener("abort", settle);
		if (notify) onQueueSettled();
	};
	const settle = () => close(true);
	const waiter = {
		handle,
		resolve: settle,
		settleOnAbort: true
	};
	waiters.add(waiter);
	EMBEDDED_RUN_WAITERS.set(sessionId, waiters);
	abortSignal?.addEventListener("abort", settle, { once: true });
	if (abortSignal?.aborted || handle.isAborted?.()) settle();
	try {
		const outcome = await queueEmbeddedAgentMessageAsync(sessionId, text, {
			...options,
			onQueueSettled: settle
		}, canInject);
		if (!outcome.queued) close(false);
		return outcome;
	} catch (error) {
		close(false);
		throw error;
	}
}
async function queueEmbeddedAgentMessageAsync(sessionId, text, options, canInject) {
	const prepared = prepareEmbeddedAgentQueueMessage(sessionId, options, canInject);
	const enqueuedAtMs = Date.now();
	const unconfirmed = (errorMessage) => {
		diagnosticLogger.warn(`queue message accepted without confirmation: sessionId=${sessionId} err=${errorMessage}`);
		logActiveRunMessageAccepted(sessionId);
		return {
			queued: true,
			sessionId,
			target: "embedded_run",
			gatewayHealth: "live",
			...prepared.kind === "embedded_run" && prepared.runId ? { runId: prepared.runId } : {},
			transcriptCommit: "unconfirmed",
			errorMessage,
			enqueuedAtMs
		};
	};
	const failed = (error) => {
		if (error instanceof QuestionAnswerUnconfirmedError) throw error;
		const errorMessage = formatErrorMessage(error);
		diagnosticLogger.debug(`queue message rejected: sessionId=${sessionId} err=${errorMessage}`);
		return createQueueFailureOutcome(sessionId, "runtime_rejected", errorMessage);
	};
	if (prepared.kind === "complete") {
		const { outcome, pendingInput } = prepared;
		if (!outcome.queued && options?.isInboundUserMessage === true && pendingInput) {
			const authorityMismatch = outcome.reason === "tool_authority_mismatch" || outcome.reason === "input_visibility_mismatch";
			if (hasPromptImageInput(options)) {
				if (authorityMismatch || outcome.reason === "image_input_unsupported") try {
					await pendingInput.cancelPendingUserInput?.("image-reply");
				} catch (err) {
					diagnosticLogger.warn(`failed to cancel pending user input before queued image fallback: sessionId=${sessionId} err=${formatErrorMessage(err)}`);
				}
			} else if (authorityMismatch && pendingInput.claimPendingUserInputAnswer) {
				const claimPendingUserInputAnswer = pendingInput.claimPendingUserInputAnswer;
				try {
					if (await claimPendingUserInputAnswer(text, options)) {
						options.onQueueAccepted?.(true);
						options.onQueueSettled?.();
						logActiveRunMessageAccepted(sessionId);
						return {
							queued: true,
							sessionId,
							target: "embedded_run",
							gatewayHealth: "live",
							enqueuedAtMs: Date.now()
						};
					}
				} catch (err) {
					return failed(err);
				}
			}
		}
		return outcome;
	}
	try {
		const queueResult = await prepared.queueMessage(text, prepared.options);
		if (queueResult?.transcriptCommit === "unconfirmed") return unconfirmed(queueResult.errorMessage);
		const deliveredAtMs = options?.waitForTranscriptCommit ? Date.now() : void 0;
		logActiveRunMessageAccepted(sessionId);
		return {
			queued: true,
			sessionId,
			target: "embedded_run",
			gatewayHealth: "live",
			...prepared.runId ? { runId: prepared.runId } : {},
			...deliveredAtMs !== void 0 ? { deliveredAtMs } : {},
			enqueuedAtMs
		};
	} catch (err) {
		return failed(err);
	}
}
function prepareEmbeddedAgentQueueMessage(sessionId, options, sourceCanInject) {
	const reject = (reason) => ({
		kind: "complete",
		outcome: createQueueFailureOutcome(sessionId, reason)
	});
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	if (!handle) {
		if (isReplyRunEvidenceStaleBySessionId(sessionId)) {
			diagnosticLogger.debug(`queue message failed: sessionId=${sessionId} reason=stale_run`);
			return reject("stale_run");
		}
		if (options?.waitForTranscriptCommit === true) {
			diagnosticLogger.debug(`queue message failed: sessionId=${sessionId} reason=transcript_commit_wait_unsupported`);
			return reject("transcript_commit_wait_unsupported");
		}
		return reject("no_active_run");
	}
	const registration = ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle);
	if (sourceCanInject && handle.messageInjectionV2?.version !== 2) return reject("guarded_injection_unsupported");
	const injection = resolveEmbeddedInjection(sessionId, handle, sourceCanInject);
	if (!injection) {
		diagnosticLogger.debug(`queue message failed: sessionId=${sessionId} reason=not_streaming`);
		return reject("not_streaming");
	}
	const recoveryBlocker = resolveActiveEmbeddedRunRecoveryBlocker(sessionId, handle);
	if (ACTIVE_EMBEDDED_RUNS.get(sessionId) !== handle) return reject("no_active_run");
	const activity = getDiagnosticSessionActivitySnapshot({ sessionId });
	if (typeof activity.lastProgressAgeMs === "number" && activity.lastProgressAgeMs > resolveRunStaleThresholdMs(activity) && !recoveryBlocker) {
		diagnosticLogger.debug(`queue message failed: sessionId=${sessionId} reason=stale_run`);
		return reject("stale_run");
	}
	if (!canSteerEmbeddedRunDuringCompaction(sessionId, handle)) {
		diagnosticLogger.debug(`queue message failed: sessionId=${sessionId} reason=compacting`);
		return reject("compacting");
	}
	if (options?.waitForTranscriptCommit === true && handle.supportsTranscriptCommitWait !== true) {
		diagnosticLogger.debug(`queue message failed: sessionId=${sessionId} reason=transcript_commit_wait_unsupported`);
		return reject("transcript_commit_wait_unsupported");
	}
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	const ownedOperation = operation && getAttachedBackend(operation) === handle ? operation : void 0;
	const { toolAuthorityOverlay, ...backendOptions } = options ?? { steeringMode: "all" };
	if (toolAuthorityOverlay) {
		try {
			backendOptions.toolAuthorityFingerprint = registration?.toolAuthority ? registration.toolAuthority.project(toolAuthorityOverlay) : ownedOperation?.projectToolAuthorityFingerprint(toolAuthorityOverlay);
		} catch {
			backendOptions.toolAuthorityFingerprint = void 0;
		}
		if (!backendOptions.toolAuthorityFingerprint) return reject("tool_authority_mismatch");
	}
	const deliveryModeMismatch = resolveReplyBackendQueueMessageMismatch(handle, backendOptions, ownedOperation);
	if (deliveryModeMismatch) {
		const activeFingerprint = normalizeOptionalString(handle.toolAuthorityFingerprint);
		const pendingInputAuthorityProven = (!toolAuthorityOverlay || deliveryModeMismatch === "input_visibility_mismatch") && (deliveryModeMismatch !== "input_visibility_mismatch" || handle.messageInjectionV2?.version === 2) && activeFingerprint && (normalizeOptionalString(backendOptions.toolAuthorityFingerprint) === activeFingerprint || !toolAuthorityOverlay && normalizeOptionalString(options?.pendingInputAuthorityFingerprint) === activeFingerprint);
		diagnosticLogger.debug(`queue message failed: sessionId=${sessionId} reason=${deliveryModeMismatch}`);
		return {
			kind: "complete",
			outcome: createQueueFailureOutcome(sessionId, deliveryModeMismatch),
			...pendingInputAuthorityProven ? { pendingInput: injection } : {}
		};
	}
	try {
		registration?.toolAuthority?.assertActive();
	} catch {
		return reject("tool_authority_mismatch");
	}
	if (ACTIVE_EMBEDDED_RUNS.get(sessionId) !== handle || ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) !== registration || ownedOperation && (resolveReplyRunForCurrentSessionId(sessionId) !== ownedOperation || getAttachedBackend(ownedOperation) !== handle)) return reject("no_active_run");
	return {
		kind: "embedded_run",
		runId: handle.runId,
		queueMessage: injection.queueMessage,
		options: backendOptions
	};
}
function revokeCompletionClaim(sessionId, runId) {
	const claim = EMBEDDED_RUN_COMPLETION_CLAIMS.get(sessionId);
	if (claim && (runId === void 0 || claim.runId === runId)) {
		claim.settleRegistration(void 0);
		EMBEDDED_RUN_COMPLETION_CLAIMS.delete(sessionId);
	}
}
function abortEmbeddedAgentRun(sessionId, opts) {
	if (typeof sessionId === "string" && sessionId.length > 0) {
		const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
		if (!handle) {
			if (abortReplyRunBySessionId(sessionId)) return true;
			diagnosticLogger.debug(`abort failed: sessionId=${sessionId} reason=no_active_run`);
			return false;
		}
		if (!isEmbeddedRunHandleAbortable(sessionId, handle)) {
			diagnosticLogger.debug(`abort failed: sessionId=${sessionId} reason=not_abortable`);
			return false;
		}
		diagnosticLogger.debug(`aborting run: sessionId=${sessionId}`);
		try {
			handle.abort(opts?.reason);
		} catch (err) {
			diagnosticLogger.warn(`abort failed: sessionId=${sessionId} err=${String(err)}`);
			return false;
		}
		revokeCompletionClaim(sessionId, handle.runId);
		notifyEmbeddedRunEnded(sessionId, handle, true);
		return true;
	}
	const mode = opts?.mode;
	if (mode !== "all" && mode !== "compacting") return false;
	const replyOwnedSessionIds = new Set(listActiveReplyRunSessionIds());
	const replyAborted = abortActiveReplyRuns({
		mode,
		onAbortError: (id, err) => diagnosticLogger.warn(`abort failed: sessionId=${id} owner=reply_run err=${String(err)}`)
	});
	let aborted = false;
	for (const [id, handle] of ACTIVE_EMBEDDED_RUNS) {
		if (replyOwnedSessionIds.has(id) || !isEmbeddedRunHandleAbortable(id, handle, mode)) continue;
		diagnosticLogger.debug(`aborting ${mode === "compacting" ? "compacting " : ""}run: sessionId=${id}`);
		try {
			handle.abort(opts?.reason);
			revokeCompletionClaim(id, handle.runId);
			notifyEmbeddedRunEnded(id, handle, true);
			aborted = true;
		} catch (err) {
			diagnosticLogger.warn(`abort failed: sessionId=${id} err=${String(err)}`);
		}
	}
	return replyAborted || aborted;
}
async function preemptAndDrainEmbeddedHeartbeatRun(sessionId, timeoutMs) {
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	if (!handle?.preemptByVisibleTurn) return "not-heartbeat";
	const drainPromise = waitForCurrentEmbeddedAgentRunEnd(sessionId, timeoutMs, handle);
	try {
		handle.preemptByVisibleTurn();
	} catch (err) {
		diagnosticLogger.warn(`heartbeat preemption failed: sessionId=${sessionId} err=${String(err)}`);
	}
	return await drainPromise ? "drained" : "timed-out";
}
function isEmbeddedAgentRunActive(sessionId) {
	const active = ACTIVE_EMBEDDED_RUNS.has(sessionId) || isReplyRunActiveForSessionId(sessionId);
	if (active) diagnosticLogger.debug(`run active check: sessionId=${sessionId} active=true`);
	return active;
}
function prepareEmbeddedAgentRunCompletionClaim(sessionId, runId) {
	const { promise: registered, resolve: settleRegistration } = createDeferredCore();
	const claim = {
		runId,
		lifecycleGeneration: getAgentEventLifecycleGeneration(),
		promoted: false,
		settleRegistration
	};
	revokeCompletionClaim(sessionId);
	EMBEDDED_RUN_COMPLETION_CLAIMS.set(sessionId, claim);
	const consume = (allowUnregistered) => {
		if (EMBEDDED_RUN_COMPLETION_CLAIMS.get(sessionId) !== claim) return false;
		EMBEDDED_RUN_COMPLETION_CLAIMS.delete(sessionId);
		if (!claim.promoted) claim.settleRegistration(void 0);
		return (allowUnregistered || claim.promoted) && isAgentEventLifecycleGenerationCurrent(claim.lifecycleGeneration);
	};
	const bindOperationalRunInstance = (instance) => {
		if (EMBEDDED_RUN_COMPLETION_CLAIMS.get(sessionId) !== claim || !isAgentEventLifecycleGenerationCurrent(claim.lifecycleGeneration) || instance.runId !== runId || claim.operationalRunInstance !== void 0 && claim.operationalRunInstance !== instance) return false;
		claim.operationalRunInstance = instance;
		return true;
	};
	const resolveCurrentRegistration = () => {
		if (EMBEDDED_RUN_COMPLETION_CLAIMS.get(sessionId) !== claim || !isAgentEventLifecycleGenerationCurrent(claim.lifecycleGeneration)) return;
		const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
		const registration = handle ? ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) : void 0;
		const toolAuthority = registration?.toolAuthority;
		if (!handle || handle.runId !== runId || !toolAuthority || !claim.operationalRunInstance || registration.operationalRunInstance !== claim.operationalRunInstance) return;
		try {
			toolAuthority.assertActive();
		} catch {
			return;
		}
		return EMBEDDED_RUN_COMPLETION_CLAIMS.get(sessionId) === claim && ACTIVE_EMBEDDED_RUNS.get(sessionId) === handle && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) === registration && isAgentEventLifecycleGenerationCurrent(claim.lifecycleGeneration) ? { toolAuthority } : void 0;
	};
	return {
		bindOperationalRunInstance,
		claimCompletion: () => consume(false),
		claimFailure: () => consume(true),
		resolveCurrentRegistration,
		registered
	};
}
/** Operational progress includes maintenance, including permission changes and cancellation. */
function resolveEmbeddedAgentRunProgressState(sessionId) {
	return resolveEmbeddedRunProgressState(sessionId, "operational");
}
function matchesSessionProgressOwner(owner, recorded) {
	const requestedAgentId = owner.agentId ?? owner.defaultAgentId;
	const recordedAgentId = recorded.agentId ?? parseAgentSessionKey(recorded.sessionKey)?.agentId ?? owner.defaultAgentId;
	return Boolean(requestedAgentId && recordedAgentId && normalizeAgentId(requestedAgentId) === normalizeAgentId(recordedAgentId));
}
/** Session presentation uses the retained run owner, even after its context is released. */
function resolveEmbeddedAgentSessionProgressState(sessionId, owner) {
	return resolveEmbeddedRunProgressState(sessionId, owner);
}
function resolveEmbeddedRunProgressState(sessionId, scope) {
	const replyOperation = resolveReplyRunForCurrentSessionId(sessionId);
	const replyPhase = replyOperation?.phase;
	const replyInProgress = replyPhase !== void 0 && replyPhase !== "completed" && replyPhase !== "failed" && replyPhase !== "aborted" && (scope === "operational" || replyOperation && matchesSessionProgressOwner(scope, {
		agentId: replyOperation.agentId,
		sessionKey: replyOperation.key
	}));
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	const registration = handle && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle);
	if (isEmbeddedRunHandleInProgress(handle) && (scope === "operational" || registration && registration.projectSessionActive !== false && matchesSessionProgressOwner(scope, registration)) || replyInProgress && replyOperation && replyPhase !== "waiting_for_global_lane" && hasReplyOperationExecutionStarted(replyOperation)) return "running";
	return replyInProgress ? "queued" : void 0;
}
function isEmbeddedAgentRunInProgress(sessionId) {
	return resolveEmbeddedAgentRunProgressState(sessionId) !== void 0;
}
function resolveEmbeddedReplyActivity(sessionId) {
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	return operation ? {
		phase: operation.phase,
		lastActivityAtMs: operation.lastActivityAtMs,
		terminalOutcomeCommitted: hasCommittedReplyOperationOutcome(operation)
	} : void 0;
}
/**
* True when work other than `runId` now holds the session. `runId` must name a
* run admitted outside reply dispatch (cron), so an active reply run is other work.
*/
function isEmbeddedAgentSessionHeldByOtherRun(sessionId, runId) {
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	return handle ? handle.runId !== runId : isReplyRunActiveForSessionId(sessionId);
}
function isEmbeddedAgentRunHandleActive(sessionId) {
	const active = ACTIVE_EMBEDDED_RUNS.has(sessionId);
	if (active) diagnosticLogger.debug(`run handle active check: sessionId=${sessionId} active=true`);
	return active;
}
function isEmbeddedAgentRunAbortableForCompaction(sessionId) {
	const active = ACTIVE_EMBEDDED_RUNS.get(sessionId) ? true : isReplyRunAbortableForCompaction(sessionId);
	if (active) diagnosticLogger.debug(`run compact coordination check: sessionId=${sessionId} active=true`);
	return active;
}
function isEmbeddedAgentRunStreaming(sessionId) {
	return ACTIVE_EMBEDDED_RUNS.get(sessionId)?.isStreaming() ?? false;
}
function resolveActiveEmbeddedRunHandleSessionId(sessionKey) {
	const normalizedSessionKey = sessionKey.trim();
	if (!normalizedSessionKey) return;
	return ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.get(normalizedSessionKey);
}
function isEmbeddedRunHandleInProgress(handle) {
	if (!handle) return false;
	try {
		return !handle.isAborted?.();
	} catch {
		return true;
	}
}
function projectActiveEmbeddedRunOwner(registration, handle) {
	const runId = handle.runId;
	if (!runId || !isEmbeddedRunHandleInProgress(handle)) return;
	return {
		runId,
		sessionId: registration.sessionId,
		...registration.sessionKey ? { sessionKey: registration.sessionKey } : {},
		...handle.startedAtMs === void 0 ? {} : { startedAtMs: handle.startedAtMs },
		abort: () => {
			if (ACTIVE_EMBEDDED_RUNS.get(registration.sessionId) !== handle || ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(runId) !== handle || !isEmbeddedRunHandleAbortable(runId, handle)) return false;
			try {
				if (handle.cancel) handle.cancel("user_abort");
				else handle.abort();
				revokeCompletionClaim(registration.sessionId, runId);
				notifyEmbeddedRunEnded(registration.sessionId, handle, true);
				return true;
			} catch {
				return false;
			}
		}
	};
}
function resolveActiveEmbeddedRunOwner(sessionId) {
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	const registration = handle ? ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) : void 0;
	return handle && registration ? projectActiveEmbeddedRunOwner(registration, handle) : void 0;
}
function resolveActiveEmbeddedRunOwnerByRunId(runId) {
	const normalizedRunId = runId.trim();
	const handle = normalizedRunId ? ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(normalizedRunId) : void 0;
	if (!handle) return;
	const registration = ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle);
	return registration && ACTIVE_EMBEDDED_RUNS.get(registration.sessionId) === handle ? projectActiveEmbeddedRunOwner(registration, handle) : void 0;
}
function isActiveEmbeddedRunId(runId) {
	const normalizedRunId = runId.trim();
	const handle = normalizedRunId ? ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(normalizedRunId) : void 0;
	const registration = handle ? ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) : void 0;
	return Boolean(handle && registration && ACTIVE_EMBEDDED_RUNS.get(registration.sessionId) === handle && isEmbeddedRunHandleInProgress(handle));
}
function resolveActiveEmbeddedRunHandleSessionIdBySessionFile(sessionFile) {
	const normalizedSessionFile = normalizeSessionFileRegistryKey(sessionFile);
	if (!normalizedSessionFile) return;
	return ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE.get(normalizedSessionFile);
}
function getActiveEmbeddedRunSnapshot(sessionId) {
	return ACTIVE_EMBEDDED_RUN_SNAPSHOTS.get(sessionId);
}
function waitForCurrentEmbeddedAgentRunEnd(sessionId, timeoutMs, handle) {
	const isHandleActive = () => handle ? ACTIVE_EMBEDDED_RUNS.get(sessionId) === handle : ACTIVE_EMBEDDED_RUNS.has(sessionId);
	if (!isHandleActive()) {
		if (handle) return Promise.resolve(true);
		return waitForReplyRunEndBySessionId(sessionId, timeoutMs);
	}
	const timeoutLabel = timeoutMs === null ? "none" : String(timeoutMs);
	diagnosticLogger.debug(`waiting for run end: sessionId=${sessionId} timeoutMs=${timeoutLabel}`);
	return new Promise((resolve) => {
		const waiters = EMBEDDED_RUN_WAITERS.get(sessionId) ?? /* @__PURE__ */ new Set();
		const waiter = {
			resolve,
			handle
		};
		if (timeoutMs !== null) waiter.timer = setTimeout(() => {
			waiters.delete(waiter);
			if (waiters.size === 0) EMBEDDED_RUN_WAITERS.delete(sessionId);
			diagnosticLogger.warn(`wait timeout: sessionId=${sessionId} timeoutMs=${timeoutMs}`);
			resolve(false);
		}, resolveTimerTimeoutMs(timeoutMs, 100, 100));
		waiters.add(waiter);
		EMBEDDED_RUN_WAITERS.set(sessionId, waiters);
		if (!isHandleActive()) {
			waiters.delete(waiter);
			if (waiters.size === 0) EMBEDDED_RUN_WAITERS.delete(sessionId);
			if (waiter.timer) clearTimeout(waiter.timer);
			resolve(true);
		}
	});
}
async function waitForEmbeddedAgentRunEnd(sessionId, timeoutMs = 15e3) {
	if (!sessionId) return true;
	const deadline = timeoutMs === null ? void 0 : Date.now() + timeoutMs;
	while (isEmbeddedAgentRunActive(sessionId)) {
		const remainingMs = deadline === void 0 ? null : deadline - Date.now();
		if (remainingMs !== null && remainingMs <= 0) return false;
		if (!await waitForCurrentEmbeddedAgentRunEnd(sessionId, remainingMs)) return false;
	}
	return true;
}
async function abortAndDrainEmbeddedAgentRun(params) {
	const settleMs = params.settleMs ?? 15e3;
	const settleDeadline = Date.now() + settleMs;
	const embeddedRunHandle = ACTIVE_EMBEDDED_RUNS.get(params.sessionId);
	const agentId = embeddedRunHandle ? ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(embeddedRunHandle)?.agentId : void 0;
	const replyOperation = resolveReplyRunForCurrentSessionId(params.sessionId);
	if (params.reason === "stuck_recovery" && replyOperation && hasCommittedReplyOperationOutcome(replyOperation)) return {
		aborted: false,
		drained: false,
		forceCleared: false
	};
	const staleExpiryBarrier = params.reason === "stuck_recovery" ? createDeferredCore() : void 0;
	const expiredReplyRun = params.reason === "stuck_recovery" && expireStaleReplyRunBySessionId(params.sessionId, "stuck_recovery", {
		afterClearBarrier: staleExpiryBarrier?.promise,
		followupAdmissionBarrierTimeout: settleMs + 1e3
	});
	const stampedStaleReplyRun = params.reason === "stuck_recovery" && replyOperation?.staleExpiryReason === "stuck_recovery";
	const waitForExpiredOwnerSettlement = async () => {
		if (!stampedStaleReplyRun || !replyOperation) return true;
		const settled = await waitForReplyOperationOwnerSettlement(replyOperation, Math.max(100, settleDeadline - Date.now()));
		if (!settled) diagnosticLogger.warn(`stuck recovery: reply owner settlement timed out sessionId=${params.sessionId} settleMs=${settleMs}`);
		return settled;
	};
	try {
		if (expiredReplyRun && !ACTIVE_EMBEDDED_RUNS.has(params.sessionId)) await new Promise((resolve) => {
			setImmediate(resolve);
		});
		let aborted = abortEmbeddedAgentRun(params.sessionId) || expiredReplyRun;
		const embeddedDrained = aborted || stampedStaleReplyRun ? await waitForEmbeddedAgentRunEnd(params.sessionId, settleMs) : false;
		const ownerSettled = await waitForExpiredOwnerSettlement();
		const drained = embeddedDrained && ownerSettled;
		if (!aborted && stampedStaleReplyRun && drained) aborted = true;
		const persistenceSnapshot = params.forceClear === true && params.sessionKey ? tryLoadForceClearSessionSnapshot(params.sessionKey, agentId) : void 0;
		const forceCleared = params.forceClear === true && (!expiredReplyRun && stampedStaleReplyRun && !ownerSettled || !aborted || !drained) ? await forceClearEmbeddedAgentRun(params.sessionId, embeddedRunHandle, replyOperation, params.sessionKey, params.reason) : false;
		if (forceCleared && params.sessionKey && persistenceSnapshot) await persistForceClearedEmbeddedRunTerminalState({
			...persistenceSnapshot,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey
		});
		return {
			aborted,
			drained,
			forceCleared
		};
	} finally {
		staleExpiryBarrier?.resolve();
	}
}
function tryLoadForceClearSessionSnapshot(sessionKey, preparedAgentId) {
	try {
		const cfg = getRuntimeConfig();
		const agentId = resolveSessionAgentId({
			config: cfg,
			sessionKey,
			agentId: preparedAgentId
		});
		const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
		const entry = loadSessionEntry({
			agentId,
			sessionKey,
			storePath
		});
		if (!entry || entry.status !== "running") return;
		return {
			agentId,
			...entry.startedAt === void 0 ? {} : { startedAt: entry.startedAt },
			storePath,
			updatedAt: entry.updatedAt
		};
	} catch (err) {
		diagnosticLogger.warn(`load force-clear session snapshot failed: sessionKey=${sessionKey} error=${String(err)}`);
		return;
	}
}
/** Persists terminal state when a forced registry clear cannot emit normal lifecycle. */
async function persistForceClearedEmbeddedRunTerminalState(params) {
	try {
		await patchSessionEntryCore({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}, (entry) => {
			if (ACTIVE_EMBEDDED_RUNS.has(params.sessionId) || ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.has(params.sessionKey) || isReplyRunActiveForSessionId(params.sessionId) || resolveActiveReplyRunSessionId(params.sessionKey) !== void 0 || entry.sessionId !== params.sessionId || entry.status !== "running" || entry.updatedAt !== params.updatedAt || entry.startedAt !== params.startedAt) return null;
			const endedAt = Date.now();
			return {
				status: "killed",
				abortedLastRun: true,
				lifecycleRunId: void 0,
				endedAt,
				updatedAt: endedAt
			};
		}, {
			skipMaintenance: true,
			takeCacheOwnership: true,
			requireWriteSuccess: false
		});
	} catch (err) {
		diagnosticLogger.warn(`persist force-cleared terminal state failed: sessionKey=${params.sessionKey} error=${String(err)}`);
	}
}
function notifyEmbeddedRunEnded(sessionId, endedHandle, aborted = false) {
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
function setActiveEmbeddedRun(sessionId, handle, sessionKey, sessionFile, agentId) {
	const currentLifecycleGeneration = getAgentEventLifecycleGeneration();
	const incomingLifecycleGeneration = setActiveEmbeddedRunLifecycleGeneration(handle, currentLifecycleGeneration);
	if (!isAgentEventLifecycleGenerationCurrent(incomingLifecycleGeneration)) {
		revokeCompletionClaim(sessionId, handle.runId);
		try {
			handle.abort("restart");
		} catch (error) {
			diagnosticLogger.warn(`stale run registration abort failed: sessionId=${sessionId} err=${String(error)}`);
			throw error;
		}
		return;
	}
	if (handle.diagnosticOwner && isDiagnosticEmbeddedRunOwnerClosed(handle.diagnosticOwner)) {
		revokeCompletionClaim(sessionId, handle.runId);
		handle.abort("restart");
		return;
	}
	const caller = getGatewayToolCallerIdentity();
	let toolAuthority;
	try {
		toolAuthority = caller?.embeddedRunToolAuthorityBinding?.({
			sessionId,
			sessionKey,
			sessionFile,
			agentId,
			handle
		});
	} catch (error) {
		revokeCompletionClaim(sessionId, handle.runId);
		throw error;
	}
	const previousHandle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	const wasActive = previousHandle !== void 0;
	if (previousHandle) {
		previousHandle.closeDiagnostics?.();
		clearEmbeddedRunAbortability(previousHandle, { retainFinalizing: true });
		EMBEDDED_RUN_FORCED_TERMINAL_SETTLEMENTS.delete(previousHandle);
	}
	try {
		toolAuthority?.assertActive();
	} catch (error) {
		revokeCompletionClaim(sessionId, handle.runId);
		throw error;
	}
	clearEmbeddedRunAbandonment({
		sessionId,
		sessionKey,
		sessionFile
	});
	ACTIVE_EMBEDDED_RUNS.set(sessionId, handle);
	const operationalRunInstance = caller?.operationalRunInstance;
	const runContext = handle.runId ? getAgentRunContext(handle.runId) : void 0;
	ACTIVE_EMBEDDED_RUN_REGISTRATIONS.set(handle, {
		projectSessionActive: runContext?.lifecycleGeneration === incomingLifecycleGeneration ? runContext.projectSessionActive : void 0,
		toolAuthority,
		operationalRunInstance,
		sessionId,
		agentId: agentId ?? (toolAuthority ? caller?.agentId : void 0),
		...sessionKey ? { sessionKey } : {},
		delegatedAuthority: operationalRunInstance?.runId === handle.runId && operationalRunInstance ? getActiveAgentRunDelegatedAuthority(operationalRunInstance) : void 0,
		onHumanInputResolved: () => {
			const operation = resolveReplyRunForCurrentSessionId(sessionId);
			if (operation && getAttachedBackend(operation) === handle) operation.recordActivity();
			markDiagnosticRunProgress({
				sessionId,
				sessionKey,
				reason: "human_input:resolved"
			});
			logSessionStateChange({
				sessionId,
				sessionKey,
				sessionFile,
				state: "processing",
				reason: "human_input_resolved"
			});
		}
	});
	const forcedTerminalSettlement = resolveSessionPlacementForcedTerminalSettlement();
	if (forcedTerminalSettlement) EMBEDDED_RUN_FORCED_TERMINAL_SETTLEMENTS.set(handle, forcedTerminalSettlement);
	if (handle.runId) ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.set(handle.runId, handle);
	clearActiveRunSessionIndex(ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY, sessionId);
	const normalizedSessionKey = sessionKey?.trim();
	if (normalizedSessionKey) ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.set(normalizedSessionKey, sessionId);
	clearActiveRunSessionIndex(ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE, sessionId);
	const normalizedSessionFile = normalizeSessionFileRegistryKey(sessionFile);
	if (normalizedSessionFile) ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE.set(normalizedSessionFile, sessionId);
	logSessionStateChange({
		sessionId,
		sessionKey,
		sessionFile,
		state: "processing",
		reason: wasActive ? "run_replaced" : "run_started"
	});
	markDiagnosticEmbeddedRunStarted({
		sessionId,
		sessionKey,
		runId: handle.runId,
		owner: handle.diagnosticOwner
	});
	if (!sessionId.startsWith("probe-")) diagnosticLogger.debug(`run registered: sessionId=${sessionId} totalActive=${ACTIVE_EMBEDDED_RUNS.size}`);
	const completionClaim = EMBEDDED_RUN_COMPLETION_CLAIMS.get(sessionId);
	if (completionClaim && completionClaim.runId === handle.runId && completionClaim.lifecycleGeneration === incomingLifecycleGeneration && (completionClaim.operationalRunInstance === void 0 || completionClaim.operationalRunInstance === operationalRunInstance)) {
		completionClaim.promoted = true;
		completionClaim.settleRegistration(toolAuthority ? { toolAuthority } : void 0);
	} else if (completionClaim) revokeCompletionClaim(sessionId);
}
function updateActiveEmbeddedRunSnapshot(sessionId, snapshot) {
	if (!ACTIVE_EMBEDDED_RUNS.has(sessionId)) return;
	ACTIVE_EMBEDDED_RUN_SNAPSHOTS.set(sessionId, snapshot);
}
function removeActiveEmbeddedRun(sessionId, handle, sessionKey, opts) {
	handle.closeDiagnostics?.();
	ACTIVE_EMBEDDED_RUNS.delete(sessionId);
	clearEmbeddedRunAbortability(handle, opts);
	ACTIVE_EMBEDDED_RUN_SNAPSHOTS.delete(sessionId);
	clearActiveRunSessionIndex(ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY, sessionId, sessionKey?.trim());
	clearActiveRunSessionIndex(ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE, sessionId);
}
function clearActiveEmbeddedRun(sessionId, handle, sessionKey, sessionFile, reason = "run_completed") {
	const activeHandle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	if (activeHandle === handle) {
		removeActiveEmbeddedRun(sessionId, handle, sessionKey, { retainFinalizing: true });
		logSessionStateChange({
			sessionId,
			sessionKey,
			sessionFile,
			state: "idle",
			reason
		});
		if (!handle.diagnosticOwner) markDiagnosticEmbeddedRunEnded({
			sessionId,
			sessionKey
		});
		if (!sessionId.startsWith("probe-")) diagnosticLogger.debug(`run cleared: sessionId=${sessionId} totalActive=${ACTIVE_EMBEDDED_RUNS.size}`);
	} else if (activeHandle !== void 0) diagnosticLogger.debug(`run clear skipped: sessionId=${sessionId} reason=handle_mismatch`);
	EMBEDDED_RUN_FORCED_TERMINAL_SETTLEMENTS.delete(handle);
	notifyEmbeddedRunEnded(sessionId, handle);
}
async function forceClearEmbeddedAgentRun(sessionId, expectedHandle, expectedReplyOperation, sessionKey, reason = "stuck_recovery") {
	let cleared = false;
	let forcedTerminalSettlement;
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	if (handle && handle === expectedHandle) {
		forcedTerminalSettlement = EMBEDDED_RUN_FORCED_TERMINAL_SETTLEMENTS.get(handle);
		EMBEDDED_RUN_FORCED_TERMINAL_SETTLEMENTS.delete(handle);
		removeActiveEmbeddedRun(sessionId, handle, sessionKey);
		logSessionStateChange({
			sessionId,
			sessionKey,
			state: "idle",
			reason
		});
		if (!handle.diagnosticOwner) markDiagnosticEmbeddedRunEnded({
			sessionId,
			sessionKey
		});
		notifyEmbeddedRunEnded(sessionId, handle);
		cleared = true;
	}
	const cause = /* @__PURE__ */ new Error(`Embedded run force-cleared by ${reason}`);
	try {
		return (expectedReplyOperation ? forceClearReplyOperation(expectedReplyOperation, cause) : false) || cleared;
	} finally {
		await forcedTerminalSettlement?.();
	}
}
//#endregion
export { resolveEmbeddedRunAbandonment as A, resolveActiveEmbeddedRunHandleSessionId as C, resolveEmbeddedAgentRunProgressState as D, resolveActiveEmbeddedRunOwnerByRunId as E, updateActiveEmbeddedRunSnapshot as F, waitForEmbeddedAgentRunEnd as I, retainEmbeddedAgentRunAbortabilityForRunId as M, setActiveEmbeddedRun as N, resolveEmbeddedAgentSessionProgressState as O, supersedeEmbeddedAgentRunByRunId as P, queueGuardedEmbeddedAgentMessageWithOutcomeAsync as S, resolveActiveEmbeddedRunOwner as T, markEmbeddedRunRecoveringTimeout as _, clearEmbeddedAgentRunAbortabilityForRunId as a, queueEmbeddedAgentMessageWithOutcome as b, isActiveEmbeddedRunId as c, isEmbeddedAgentRunActive as d, isEmbeddedAgentRunHandleActive as f, markActiveEmbeddedRunAbandoned as g, isEmbeddedAgentSessionHeldByOtherRun as h, clearActiveEmbeddedRun as i, restoreEmbeddedRunTimeoutAbandonment as j, resolveEmbeddedReplyActivity as k, isEmbeddedAgentRunAbortableForCompaction as l, isEmbeddedAgentRunStreaming as m, abortEmbeddedAgentRun as n, formatEmbeddedAgentQueueFailureSummary as o, isEmbeddedAgentRunInProgress as p, claimPendingEmbeddedAgentQuestionAnswer as r, getActiveEmbeddedRunSnapshot as s, abortAndDrainEmbeddedAgentRun as t, isEmbeddedAgentRunAbortableForRunId as u, preemptAndDrainEmbeddedHeartbeatRun as v, resolveActiveEmbeddedRunHandleSessionIdBySessionFile as w, queueEmbeddedAgentMessageWithOutcomeAsync as x, prepareEmbeddedAgentRunCompletionClaim as y };
