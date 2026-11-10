import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { c as readErrorCauses, r as collectErrorGraphCandidates } from "./error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { l as getActiveAgentRunDelegatedAuthority, u as getAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { d as getAgentEventLifecycleGeneration, f as isAgentEventLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as settlesWithin } from "./settle-within-DLEx44ea.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import "./io-DIF-KW3P.mjs";
import { o as getGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { S as normalizeSessionFileRegistryKey, a as ACTIVE_EMBEDDED_RUNS_BY_RUN_ID, b as setActiveEmbeddedRunSessionIndexes, c as ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY, d as EMBEDDED_RUN_FORCED_TERMINAL_SETTLEMENTS, f as EMBEDDED_RUN_WAITERS, i as ACTIVE_EMBEDDED_RUNS, l as ACTIVE_EMBEDDED_RUN_SNAPSHOTS, n as ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE, o as ACTIVE_EMBEDDED_RUN_REGISTRATIONS, p as RETAINED_EMBEDDED_RUN_ABORTABILITY_RUN_IDS, r as ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY, s as ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE, t as ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID, u as EMBEDDED_RUN_COMPLETION_CLAIMS, v as resolveActiveEmbeddedRunRecoveryBlocker, x as clearActiveRunSessionIndex, y as setActiveEmbeddedRunLifecycleGeneration } from "./run-state-DZ4Vfz1J.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner, o as runWithSessionActorStorage, t as acquireSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { t as notifyGatewayWorkMetricsChanged } from "./gateway-work-metrics-events-SooEjUbR.mjs";
import { i as MessageInjectionWithdrawnError, n as MessageInjectionAuthorityError, t as MessageInjectionAcceptedUnconfirmedError } from "./message-injection-authority-Mu3hgByB.mjs";
import { $ as isEmbeddedRunHandleSupersedable, Q as isEmbeddedRunHandleInProgress, X as canSteerEmbeddedRunDuringCompaction, Z as isEmbeddedRunHandleAbortable, b as isReplyOperationAbortable, h as getAttachedBackend, m as forceClearReplyOperation, v as hasCommittedReplyOperationOutcome, y as hasReplyOperationExecutionStarted, z as resolveReplyRunForCurrentSessionId } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import { a as logMessageQueuedWithBacklogPolicy, t as diagnosticLogger } from "./diagnostic-runtime-BpQSBSkN.mjs";
import { n as QuestionAnswerUnconfirmedError } from "./gateway-question-dispatch-CakNMdfI.mjs";
import { t as hasPromptImageInput } from "./prompt-image-input-Urne2gUL.mjs";
import { b as resolveRunStaleThresholdMs, f as markDiagnosticRunProgress, l as markDiagnosticEmbeddedRunEnded, o as getDiagnosticSessionActivitySnapshot, s as isDiagnosticEmbeddedRunOwnerClosed, u as markDiagnosticEmbeddedRunStarted } from "./diagnostic-run-activity-CaoGYSHp.mjs";
import { A as resolveEmbeddedInjection, N as resolveReplyBackendQueueMessageMismatch, O as createEmbeddedMessageInjectionQueue, _ as resolveActiveReplyRunSessionId, a as expireStaleReplyRunBySessionId, b as supersedeReplyRunByRunId, d as isReplyRunActiveForSessionId, f as isReplyRunEvidenceStaleBySessionId, k as prepareEmbeddedInjectionAuthority, n as abortReplyRunBySessionId, p as listActiveReplyRunSessionIds, t as abortActiveReplyRuns, u as isReplyRunAbortableForCompaction, x as waitForReplyOperationOwnerSettlement } from "./reply-run-registry.registry-CmcnzV4X.mjs";
import { a as notifyEmbeddedRunEnded, c as waitForEmbeddedAgentRunEnd, s as waitForCurrentEmbeddedAgentRunEnd } from "./active-run-projections-Crpg2l0z.mjs";
import "./reply-run-registry-BFUfTf-U.mjs";
import { o as logSessionStateChange } from "./diagnostic-Dz-YV3uh.mjs";
import { t as resolveSessionPlacementForcedTerminalSettlement } from "./session-placement-forced-terminal-settlement-Buc-FlZv.mjs";
//#region src/agents/embedded-agent-runner/force-clear-session-state.ts
async function tryLoadForceClearSessionSnapshot(sessionKey, preparedAgentId, runId) {
	try {
		const cfg = readRuntimeConfig();
		const agentId = resolveSessionAgentId({
			config: cfg,
			sessionKey,
			agentId: preparedAgentId
		});
		const configuredStorePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
		const source = captureSessionActorStorageOwner({
			agentId,
			sessionKey,
			storePath: configuredStorePath
		}, {
			assertCurrent() {},
			authorize() {}
		});
		const storePath = source?.path ?? configuredStorePath;
		const entry = source ? readCapturedSessionActorEntry(source, sessionKey) : await readSessionEntryReadOnlyInWorker({
			agentId,
			sessionKey,
			storePath
		});
		if (!entry || entry.status !== void 0 || runId !== void 0 && entry.lifecycleRunId !== runId) return;
		return {
			agentId,
			memory: source,
			lifecycleRunId: entry.lifecycleRunId,
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
async function persistForceClearedEmbeddedRunTerminalState(params, hasActiveRun) {
	try {
		const persist = () => patchSessionEntryCore({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}, (entry) => {
			if (hasActiveRun(params.sessionId, params.sessionKey) || entry.sessionId !== params.sessionId || entry.status !== void 0 || entry.lifecycleRunId !== params.lifecycleRunId || entry.updatedAt !== params.updatedAt || entry.startedAt !== params.startedAt) return null;
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
		if (params.memory) {
			const source = params.memory;
			const lifetime = {
				assertCurrent: () => source.authority.assertCurrent(),
				assertReadable: () => source.authority.assertCurrent()
			};
			const actor = source.owner ? await source.owner.acquireExisting(params.sessionKey, lifetime) : source.binding ? (await acquireSessionActorStorage({
				...params,
				sessionActor: source.binding
			}, {
				lifetime,
				authority: source.authority
			}))?.actor : void 0;
			if (!actor) return;
			try {
				await runWithSessionActorStorage({
					...source,
					actor
				}, persist);
			} finally {
				await actor.release();
			}
		} else await persist();
	} catch (err) {
		diagnosticLogger.warn(`persist force-cleared terminal state failed: sessionKey=${params.sessionKey} error=${String(err)}`);
	}
}
//#endregion
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
function clearEmbeddedRunAbandonmentBySessionId(sessionId) {
	const abandonedRun = ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID.get(sessionId);
	if (!abandonedRun) return;
	ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID.delete(sessionId);
	const clearIndex = (index, key) => {
		if (key && index.get(key) === sessionId) index.delete(key);
	};
	clearIndex(ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY, abandonedRun.sessionKey?.trim());
	clearIndex(ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE, normalizeSessionFileRegistryKey(abandonedRun.sessionFile));
}
function clearEmbeddedRunAbandonment(params) {
	const normalizedSessionId = params.sessionId?.trim();
	if (normalizedSessionId) clearEmbeddedRunAbandonmentBySessionId(normalizedSessionId);
	for (const [key, index] of [[params.sessionKey?.trim(), ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY], [normalizeSessionFileRegistryKey(params.sessionFile), ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE]]) {
		const sessionId = key ? index.get(key) : void 0;
		if (sessionId) clearEmbeddedRunAbandonmentBySessionId(sessionId);
	}
}
function markActiveEmbeddedRunAbandoned(params) {
	const sessionId = params.sessionId.trim();
	if (!sessionId || ACTIVE_EMBEDDED_RUNS.get(sessionId) !== params.handle) return false;
	const abandonedParams = {
		...params,
		runId: params.handle.runId
	};
	clearEmbeddedRunAbandonment({
		...abandonedParams,
		sessionId
	});
	const normalizedSessionFile = normalizeSessionFileRegistryKey(abandonedParams.sessionFile);
	const abandonedRun = {
		sessionId,
		...abandonedParams.runId?.trim() ? { runId: abandonedParams.runId.trim() } : {},
		abandonedAtMs: Date.now(),
		reason: abandonedParams.reason,
		...abandonedParams.sessionKey?.trim() ? { sessionKey: abandonedParams.sessionKey.trim() } : {},
		...normalizedSessionFile ? { sessionFile: normalizedSessionFile } : {}
	};
	ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID.set(sessionId, abandonedRun);
	if (abandonedRun.sessionKey) ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY.set(abandonedRun.sessionKey, sessionId);
	if (abandonedRun.sessionFile) ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE.set(abandonedRun.sessionFile, sessionId);
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
		diagnosticLogger[err instanceof QuestionAnswerUnconfirmedError ? "warn" : "debug"](message);
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
function isEmbeddedAgentRunAbortableForRunId(runId) {
	const normalizedRunId = runId.trim();
	const handle = normalizedRunId ? ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(normalizedRunId) : void 0;
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
	ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle)?.waits?.clear();
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
async function queueGuardedEmbeddedAgentMessageWithOutcomeAsync(sessionId, text, options, canInject, sourcePreparation) {
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	const onQueueSettled = options?.onQueueSettled;
	if (!handle || !onQueueSettled) return queueEmbeddedAgentMessageAsync(sessionId, text, options, canInject, sourcePreparation);
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
		}, canInject, sourcePreparation);
		if (!outcome.queued) close(false);
		return outcome;
	} catch (error) {
		close(false);
		throw error;
	}
}
const queueEmbeddedAgentMessageAsync = createEmbeddedMessageInjectionQueue(async (...args) => {
	const [sessionId, input, options, canInject, sourcePreparation, release, assertCurrent] = args;
	let text = input;
	let prepared;
	try {
		assertCurrent();
		text = await sourcePreparation?.prepareMessage?.() ?? text;
		assertCurrent();
		const authority = options?.toolAuthorityOverlay || sourcePreparation ? await prepareEmbeddedInjectionAuthority(sessionId, options, canInject, sourcePreparation) : void 0;
		assertCurrent();
		prepared = prepareEmbeddedAgentQueueMessage(sessionId, options, canInject, authority, sourcePreparation);
	} catch (error) {
		if (error instanceof MessageInjectionAuthorityError) return createQueueFailureOutcome(sessionId, "tool_authority_mismatch");
		return createQueueFailureOutcome(sessionId, "runtime_rejected", formatErrorMessage(error));
	}
	const enqueuedAtMs = Date.now();
	const queuedOutcome = {
		queued: true,
		sessionId,
		target: "embedded_run",
		gatewayHealth: "live"
	};
	let queueAccepted = false;
	const unconfirmed = (errorMessage) => {
		diagnosticLogger.warn(`queue message accepted without confirmation: sessionId=${sessionId} err=${errorMessage}`);
		logActiveRunMessageAccepted(sessionId);
		return {
			...queuedOutcome,
			...prepared.kind === "embedded_run" && prepared.runId ? { runId: prepared.runId } : {},
			transcriptCommit: "unconfirmed",
			errorMessage,
			enqueuedAtMs
		};
	};
	const failed = (error) => {
		const candidates = collectErrorGraphCandidates(error, readErrorCauses);
		const accepted = candidates.findLast((candidate) => candidate instanceof MessageInjectionAcceptedUnconfirmedError);
		const questionUnconfirmed = candidates.findLast((candidate) => candidate instanceof QuestionAnswerUnconfirmedError);
		const withdrawn = candidates.some((candidate) => candidate instanceof MessageInjectionWithdrawnError);
		if (accepted || queueAccepted && (!withdrawn || questionUnconfirmed)) return unconfirmed(accepted?.message ?? formatErrorMessage(error));
		if (questionUnconfirmed) throw questionUnconfirmed;
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
					const cancellation = pendingInput.cancelPendingUserInput?.("image-reply");
					release();
					await cancellation;
				} catch (err) {
					diagnosticLogger.warn(`failed to cancel pending user input before queued image fallback: sessionId=${sessionId} err=${formatErrorMessage(err)}`);
				}
			} else if (authorityMismatch && pendingInput.claimPendingUserInputAnswer) {
				const claimPendingUserInputAnswer = pendingInput.claimPendingUserInputAnswer;
				try {
					const claim = claimPendingUserInputAnswer(text, options);
					release();
					if (await claim) {
						queueAccepted = true;
						options.onQueueAccepted?.(true);
						options.onQueueSettled?.();
						logActiveRunMessageAccepted(sessionId);
						return {
							...queuedOutcome,
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
		if (prepared.prepareQueueMessage) await prepared.prepareQueueMessage();
		const delivery = prepared.queueMessage(text, {
			...prepared.options,
			onQueueAccepted: (accepted) => {
				queueAccepted ||= accepted;
				prepared.options.onQueueAccepted?.(accepted);
			}
		});
		release();
		const queueResult = await delivery;
		queueAccepted = true;
		if (queueResult?.transcriptCommit === "unconfirmed") return unconfirmed(queueResult.errorMessage);
		const deliveredAtMs = options?.waitForTranscriptCommit ? Date.now() : void 0;
		logActiveRunMessageAccepted(sessionId);
		return {
			...queuedOutcome,
			...prepared.runId ? { runId: prepared.runId } : {},
			...deliveredAtMs !== void 0 ? { deliveredAtMs } : {},
			enqueuedAtMs
		};
	} catch (err) {
		return failed(err);
	}
});
function prepareEmbeddedAgentQueueMessage(sessionId, options, sourceCanInject, prepared, sourcePreparation) {
	const preparation = prepared?.preparation ?? sourcePreparation;
	preparation?.assertCurrent();
	const reject = (reason, logFailure = false) => {
		if (logFailure) diagnosticLogger.debug(`queue message failed: sessionId=${sessionId} reason=${reason}`);
		return {
			kind: "complete",
			outcome: createQueueFailureOutcome(sessionId, reason)
		};
	};
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	if (!handle) {
		if (isReplyRunEvidenceStaleBySessionId(sessionId)) return reject("stale_run", true);
		if (options?.waitForTranscriptCommit === true) return reject("transcript_commit_wait_unsupported", true);
		return reject("no_active_run");
	}
	const registration = ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle);
	if (sourceCanInject && handle.messageInjectionV2?.version !== 2) return reject("guarded_injection_unsupported");
	const injection = resolveEmbeddedInjection(sessionId, handle, sourceCanInject, preparation, options);
	if (!injection) return reject("not_streaming", true);
	const recoveryBlocker = resolveActiveEmbeddedRunRecoveryBlocker(sessionId, handle);
	if (ACTIVE_EMBEDDED_RUNS.get(sessionId) !== handle) return reject("no_active_run");
	const activity = getDiagnosticSessionActivitySnapshot({ sessionId });
	if (typeof activity.lastProgressAgeMs === "number" && activity.lastProgressAgeMs > resolveRunStaleThresholdMs(activity) && !recoveryBlocker) return reject("stale_run", true);
	if (!canSteerEmbeddedRunDuringCompaction(sessionId, handle)) return reject("compacting", true);
	if (options?.waitForTranscriptCommit === true && handle.supportsTranscriptCommitWait !== true) return reject("transcript_commit_wait_unsupported", true);
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	const ownedOperation = operation && getAttachedBackend(operation) === handle ? operation : void 0;
	const { toolAuthorityOverlay, ...backendOptions } = options ?? { steeringMode: "all" };
	if (toolAuthorityOverlay) {
		try {
			backendOptions.toolAuthorityFingerprint = prepared ? prepared.fingerprint : registration?.toolAuthority ? registration.toolAuthority.project(toolAuthorityOverlay) : ownedOperation?.projectToolAuthorityFingerprint(toolAuthorityOverlay);
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
		prepareQueueMessage: injection.prepareQueueMessage,
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
	} finally {
		notifyGatewayWorkMetricsChanged();
	}
	return await drainPromise ? "drained" : "timed-out";
}
function logActiveRunCheck(sessionId, active, label) {
	if (active) diagnosticLogger.debug(`${label}: sessionId=${sessionId} active=true`);
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
	return logActiveRunCheck(sessionId, ACTIVE_EMBEDDED_RUNS.has(sessionId), "run handle active check");
}
function isEmbeddedAgentRunAbortableForCompaction(sessionId) {
	return logActiveRunCheck(sessionId, ACTIVE_EMBEDDED_RUNS.has(sessionId) || isReplyRunAbortableForCompaction(sessionId), "run compact coordination check");
}
function isEmbeddedAgentRunStreaming(sessionId) {
	return ACTIVE_EMBEDDED_RUNS.get(sessionId)?.isStreaming() ?? false;
}
function resolveActiveEmbeddedRunHandleSessionId(sessionKey) {
	const normalizedSessionKey = sessionKey.trim();
	return normalizedSessionKey ? ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.get(normalizedSessionKey) : void 0;
}
function projectActiveEmbeddedRunOwner(registration, handle) {
	const runId = handle.runId;
	if (!runId || !isEmbeddedRunHandleInProgress(handle)) return;
	return {
		runId,
		sessionId: registration.sessionId,
		...registration.sessionKey ? { sessionKey: registration.sessionKey } : {},
		...registration.agentId ? { agentId: registration.agentId } : {},
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
/** Lifecycle drains retain the exact handle, including compaction without a run ID. */
function captureEmbeddedRunDrainTarget(sessionId, owner) {
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	const registration = handle && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle);
	if (!handle || !registration || !matchesSessionProgressOwner(owner, registration)) return;
	const waiting = new AbortController();
	const ended = waitForCurrentEmbeddedAgentRunEnd(sessionId, null, handle, waiting.signal);
	const isActive = () => !waiting.signal.aborted && ACTIVE_EMBEDDED_RUNS.get(sessionId) === handle && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) === registration;
	return {
		sessionId,
		agentId: registration.agentId,
		sessionKey: registration.sessionKey,
		isActive,
		isAborted: () => !isEmbeddedRunHandleInProgress(handle),
		abort: () => isActive() && abortEmbeddedAgentRun(sessionId),
		waitForEnd: async (timeoutMs) => (timeoutMs === null || await settlesWithin(ended, resolveTimerTimeoutMs(timeoutMs, 100, 100))) && await ended,
		release: () => waiting.abort()
	};
}
function resolveRegisteredEmbeddedRunByRunId(runId) {
	const normalizedRunId = runId.trim();
	const handle = normalizedRunId ? ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(normalizedRunId) : void 0;
	const registration = handle ? ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) : void 0;
	return handle && registration && ACTIVE_EMBEDDED_RUNS.get(registration.sessionId) === handle ? {
		handle,
		registration
	} : void 0;
}
function resolveActiveEmbeddedRunOwnerByRunId(runId) {
	const active = resolveRegisteredEmbeddedRunByRunId(runId);
	return active ? projectActiveEmbeddedRunOwner(active.registration, active.handle) : void 0;
}
function isActiveEmbeddedRunId(runId) {
	const active = resolveRegisteredEmbeddedRunByRunId(runId);
	return Boolean(active && isEmbeddedRunHandleInProgress(active.handle));
}
function resolveActiveEmbeddedRunHandleSessionIdBySessionFile(sessionFile) {
	const normalizedSessionFile = normalizeSessionFileRegistryKey(sessionFile);
	return normalizedSessionFile ? ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE.get(normalizedSessionFile) : void 0;
}
function getActiveEmbeddedRunSnapshot(sessionId) {
	return ACTIVE_EMBEDDED_RUN_SNAPSHOTS.get(sessionId);
}
async function abortAndDrainEmbeddedAgentRun(params) {
	const isStuckRecovery = params.reason === "stuck_recovery";
	const settleMs = params.settleMs ?? 15e3;
	const settleDeadline = Date.now() + settleMs;
	const embeddedRunHandle = ACTIVE_EMBEDDED_RUNS.get(params.sessionId);
	const agentId = embeddedRunHandle ? ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(embeddedRunHandle)?.agentId : void 0;
	const replyOperation = resolveReplyRunForCurrentSessionId(params.sessionId);
	if (isStuckRecovery && replyOperation && hasCommittedReplyOperationOutcome(replyOperation)) return {
		aborted: false,
		drained: false,
		forceCleared: false
	};
	if (isStuckRecovery && embeddedRunHandle && (!replyOperation || isReplyOperationAbortable(replyOperation)) && isEmbeddedRunHandleAbortable(params.sessionId, embeddedRunHandle) && embeddedRunHandle.recoverStalledModelCall?.() === true) return {
		aborted: true,
		drained: false,
		forceCleared: false,
		recoveringModelAttempt: true
	};
	const persistenceRunId = embeddedRunHandle?.runId ?? (replyOperation ? getAttachedBackend(replyOperation)?.runId : void 0);
	const staleExpiryBarrier = isStuckRecovery ? createDeferredCore() : void 0;
	const expiredReplyRun = isStuckRecovery && expireStaleReplyRunBySessionId(params.sessionId, "stuck_recovery", {
		afterClearBarrier: staleExpiryBarrier?.promise,
		followupAdmissionBarrierTimeout: settleMs + 1e3
	});
	const stampedStaleReplyRun = isStuckRecovery && replyOperation?.staleExpiryReason === "stuck_recovery";
	try {
		if (expiredReplyRun && !ACTIVE_EMBEDDED_RUNS.has(params.sessionId)) await new Promise((resolve) => {
			setImmediate(resolve);
		});
		let aborted = abortEmbeddedAgentRun(params.sessionId) || expiredReplyRun;
		const embeddedDrained = aborted || stampedStaleReplyRun ? await waitForEmbeddedAgentRunEnd(params.sessionId, settleMs) : false;
		const ownerSettled = !stampedStaleReplyRun || !replyOperation || await waitForReplyOperationOwnerSettlement(replyOperation, Math.max(100, settleDeadline - Date.now()));
		if (!ownerSettled) diagnosticLogger.warn(`stuck recovery: reply owner settlement timed out sessionId=${params.sessionId} settleMs=${settleMs}`);
		const drained = embeddedDrained && ownerSettled;
		aborted ||= stampedStaleReplyRun && drained;
		const forceCleared = params.forceClear === true && (!expiredReplyRun && stampedStaleReplyRun && !ownerSettled || !aborted || !drained) ? await forceClearEmbeddedAgentRun(params.sessionId, embeddedRunHandle, replyOperation, params.sessionKey, params.reason) : false;
		if (forceCleared && params.sessionKey) {
			const persistenceSnapshot = await tryLoadForceClearSessionSnapshot(params.sessionKey, agentId, persistenceRunId);
			if (persistenceSnapshot) await persistForceClearedEmbeddedRunTerminalState({
				...persistenceSnapshot,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey
			}, (sessionId, sessionKey) => ACTIVE_EMBEDDED_RUNS.has(sessionId) || ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.has(sessionKey) || isReplyRunActiveForSessionId(sessionId) || resolveActiveReplyRunSessionId(sessionKey) !== void 0);
		}
		return {
			aborted,
			drained,
			forceCleared
		};
	} finally {
		staleExpiryBarrier?.resolve();
	}
}
function setActiveEmbeddedRun(sessionId, handle, sessionKey, sessionFile, agentId) {
	const sessionIdentity = {
		sessionId,
		sessionKey,
		sessionFile
	};
	const incomingLifecycleGeneration = setActiveEmbeddedRunLifecycleGeneration(handle, getAgentEventLifecycleGeneration());
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
	const revokeClaimOnFailure = (operation) => {
		try {
			return operation();
		} catch (error) {
			revokeCompletionClaim(sessionId, handle.runId);
			throw error;
		}
	};
	const toolAuthority = revokeClaimOnFailure(() => caller?.embeddedRunToolAuthorityBinding?.({
		...sessionIdentity,
		agentId,
		handle
	}));
	const previousHandle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	if (previousHandle) {
		previousHandle.closeDiagnostics?.();
		clearEmbeddedRunAbortability(previousHandle, { retainFinalizing: true });
		EMBEDDED_RUN_FORCED_TERMINAL_SETTLEMENTS.delete(previousHandle);
	}
	revokeClaimOnFailure(() => toolAuthority?.assertActive());
	clearEmbeddedRunAbandonment(sessionIdentity);
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
				...sessionIdentity,
				state: "processing",
				reason: "human_input_resolved"
			});
		}
	});
	const forcedTerminalSettlement = resolveSessionPlacementForcedTerminalSettlement();
	if (forcedTerminalSettlement) EMBEDDED_RUN_FORCED_TERMINAL_SETTLEMENTS.set(handle, forcedTerminalSettlement);
	if (handle.runId) ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.set(handle.runId, handle);
	setActiveEmbeddedRunSessionIndexes(sessionId, sessionKey, sessionFile);
	notifyGatewayWorkMetricsChanged();
	logSessionStateChange({
		...sessionIdentity,
		state: "processing",
		reason: previousHandle !== void 0 ? "run_replaced" : "run_started"
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
	if (ACTIVE_EMBEDDED_RUNS.has(sessionId)) ACTIVE_EMBEDDED_RUN_SNAPSHOTS.set(sessionId, snapshot);
}
function removeActiveEmbeddedRun(context, handle, reason, opts) {
	const { sessionId, sessionKey } = context;
	handle.closeDiagnostics?.();
	ACTIVE_EMBEDDED_RUNS.delete(sessionId);
	clearEmbeddedRunAbortability(handle, opts);
	ACTIVE_EMBEDDED_RUN_SNAPSHOTS.delete(sessionId);
	clearActiveRunSessionIndex(ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY, sessionId, sessionKey?.trim());
	clearActiveRunSessionIndex(ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE, sessionId);
	notifyGatewayWorkMetricsChanged();
	logSessionStateChange({
		...context,
		state: "idle",
		reason
	});
	if (!handle.diagnosticOwner) markDiagnosticEmbeddedRunEnded({
		sessionId,
		sessionKey
	});
}
function clearActiveEmbeddedRun(sessionId, handle, sessionKey, sessionFile, reason = "run_completed") {
	const activeHandle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	if (activeHandle === handle) {
		removeActiveEmbeddedRun({
			sessionId,
			sessionKey,
			sessionFile
		}, handle, reason, { retainFinalizing: true });
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
		removeActiveEmbeddedRun({
			sessionId,
			sessionKey
		}, handle, reason);
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
export { restoreEmbeddedRunTimeoutAbandonment as A, resolveActiveEmbeddedRunHandleSessionIdBySessionFile as C, resolveEmbeddedAgentSessionProgressState as D, resolveEmbeddedAgentRunProgressState as E, setActiveEmbeddedRun as M, supersedeEmbeddedAgentRunByRunId as N, resolveEmbeddedReplyActivity as O, updateActiveEmbeddedRunSnapshot as P, resolveActiveEmbeddedRunHandleSessionId as S, resolveActiveEmbeddedRunOwnerByRunId as T, preemptAndDrainEmbeddedHeartbeatRun as _, clearActiveEmbeddedRun as a, queueEmbeddedAgentMessageWithOutcomeAsync as b, getActiveEmbeddedRunSnapshot as c, isEmbeddedAgentRunAbortableForRunId as d, isEmbeddedAgentRunHandleActive as f, markEmbeddedRunRecoveringTimeout as g, markActiveEmbeddedRunAbandoned as h, claimPendingEmbeddedAgentQuestionAnswer as i, retainEmbeddedAgentRunAbortabilityForRunId as j, resolveEmbeddedRunAbandonment as k, isActiveEmbeddedRunId as l, isEmbeddedAgentSessionHeldByOtherRun as m, abortEmbeddedAgentRun as n, clearEmbeddedAgentRunAbortabilityForRunId as o, isEmbeddedAgentRunStreaming as p, captureEmbeddedRunDrainTarget as r, formatEmbeddedAgentQueueFailureSummary as s, abortAndDrainEmbeddedAgentRun as t, isEmbeddedAgentRunAbortableForCompaction as u, prepareEmbeddedAgentRunCompletionClaim as v, resolveActiveEmbeddedRunOwner as w, queueGuardedEmbeddedAgentMessageWithOutcomeAsync as x, queueEmbeddedAgentMessageWithOutcome as y };
