import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { c as readErrorCauses, d as toErrorObject, r as collectErrorGraphCandidates } from "./error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as createAbortError } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { v as hasGatewayContextOwner } from "./gateway-request-scope-1BXD1G3l.mjs";
import { m as SessionPendingInputCustodyError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { j as validateAgentRunDelegatedAuthority, l as getActiveAgentRunDelegatedAuthority, u as getAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { d as getAgentEventLifecycleGeneration, f as isAgentEventLifecycleGenerationCurrent, v as registerAgentEventLifecycleRotationHandler } from "./agent-events-Bf3Js0D3.mjs";
import { r as agentSessionKeysMatchByRequestKey } from "./session-key-CSDERtm3.mjs";
import { t as settlesWithin } from "./settle-within-DLEx44ea.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { a as createAgentRunDirectAbortError, d as isAgentRunSupersededAbortReason, o as createAgentRunRestartAbortError, s as createAgentRunSupersededAbortError, u as isAgentRunRestartAbortReason } from "./run-termination-Dwf1ksjA.mjs";
import { a as ACTIVE_EMBEDDED_RUNS_BY_RUN_ID, c as ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY, i as ACTIVE_EMBEDDED_RUNS, o as ACTIVE_EMBEDDED_RUN_REGISTRATIONS, v as resolveActiveEmbeddedRunRecoveryBlocker } from "./run-state-DZ4Vfz1J.mjs";
import { t as notifyGatewayWorkMetricsChanged } from "./gateway-work-metrics-events-SooEjUbR.mjs";
import { a as bindWorkerToolPreparation, m as prepareReplyToolAuthorityCallerRead, r as bindReplyToolAuthorityCallerRead } from "./host-private-capabilities-eTr803c9.mjs";
import { t as hasInboundAudio } from "./inbound-media-D9dVgt41.mjs";
import { c as enqueueMessageInjection, i as MessageInjectionWithdrawnError, n as MessageInjectionAuthorityError, r as MessageInjectionTargetUnavailableError, s as createMessageInjectionAuthority, t as MessageInjectionAcceptedUnconfirmedError } from "./message-injection-authority-Mu3hgByB.mjs";
import { A as notifyReplyRunEnded, B as resolveReplyRunWaitKey, G as startReplyOperationSuccessorBarriers, I as replyRunState, K as updateFollowupAdmissionSessionId, M as prepareReplyRunKeyUpdate, N as producerCompletionByOperation, P as registerFollowupAdmissionBarrier, R as resolveReplyOperationAgentId, S as isReplyOperationPreBackendPhase, T as isReplyRunEvidenceStale, U as retainStateUntilCompleteOperations, X as canSteerEmbeddedRunDuringCompaction, Z as isEmbeddedRunHandleAbortable, a as backendReadyByOperation, at as replyMessageInjectionTargetOwner, b as isReplyOperationAbortable, c as clearReplyRunState, d as expireStaleReplyOperation, et as REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS, h as getAttachedBackend, i as attachedBackendByOperation, it as ReplyRunSuccessorAdmissionBlockedError, j as operationsByUpstreamAbortSignal, k as mergeReplyRunAdmissionSource, l as evictReplyOperationByOperation, m as forceClearReplyOperation, nt as ReplyRunAlreadyActiveError, ot as replyRunInterruptTargetOperation, p as flushReplyOperationAfterClear, q as updateSuccessorAdmissionSessionId, rt as ReplyRunFollowupAdmissionBlockedError, s as clearReplyOperationByOperation, t as abortFrozenOperations, tt as REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS, u as expireReplyOperationByOperation, v as hasCommittedReplyOperationOutcome, w as isReplyRunCompacting, y as hasReplyOperationExecutionStarted, z as resolveReplyRunForCurrentSessionId } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import { a as logMessageQueuedWithBacklogPolicy, t as diagnosticLogger } from "./diagnostic-runtime-BpQSBSkN.mjs";
import { i as QuestionDispatchUnsupportedError, n as QuestionAnswerUnconfirmedError, r as QuestionDispatchRefusedError } from "./gateway-question-dispatch-CakNMdfI.mjs";
import { i as createLegacyToolAuthorityQueuePreflight, n as bindMessageInjectionV2, r as bindPreparedToolAuthority } from "./tool-authority-preparation-m_5xD16r.mjs";
import { t as hasPromptImageInput } from "./prompt-image-input-Urne2gUL.mjs";
import { b as resolveRunStaleThresholdMs, f as markDiagnosticRunProgress, o as getDiagnosticSessionActivitySnapshot } from "./diagnostic-run-activity-CaoGYSHp.mjs";
import { t as chatRunBelongsToAgent } from "./chat-run-owner-BB6L4tWc.mjs";
//#region src/auto-reply/reply/reply-run-registry.message-injection.ts
function resolveReplyBackendQueueMessageMismatch(backend, options, authority) {
	if (options?.isInboundUserMessage === true) {
		const runContext = backend.runId ? getAgentRunContext(backend.runId) : void 0;
		if (runContext?.isControlUiVisible === false && runContext.projectSessionMessages === false) return "input_visibility_mismatch";
		const activeFingerprint = normalizeOptionalString(backend.toolAuthorityFingerprint ?? authority?.toolAuthorityFingerprint);
		const incomingFingerprint = normalizeOptionalString(options.toolAuthorityFingerprint);
		if (!activeFingerprint || !incomingFingerprint || activeFingerprint !== incomingFingerprint) return "tool_authority_mismatch";
	}
	if (options?.terminalReplyExpectation !== void 0 && options.terminalReplyExpectation !== (backend.terminalReplyExpectation ?? "required")) return "reply_expectation_mismatch";
	if (hasPromptImageInput(options) && backend.supportsQueueMessageImages !== true) return "image_input_unsupported";
	if (options?.sourceReplyDeliveryMode === "message_tool_only" && backend.sourceReplyDeliveryMode !== "message_tool_only") return "source_reply_delivery_mode_mismatch";
	if (options !== void 0 && Object.hasOwn(options, "taskSuggestionDeliveryMode") && options?.taskSuggestionDeliveryMode !== backend.taskSuggestionDeliveryMode) return "task_suggestion_delivery_mode_mismatch";
}
function resolveReplyBackendMessageInjection(backend, canInject, sourceBound, preparation) {
	const guarded = backend.messageInjectionV2;
	const assertCurrent = createMessageInjectionAuthority(canInject);
	const legacy = preparation && !guarded?.queueMessageAsync ? createLegacyToolAuthorityQueuePreflight(preparation) : void 0;
	if (guarded?.version === 2) return {
		isAvailable: () => guarded.isAvailable(),
		...bindMessageInjectionV2(guarded, assertCurrent, sourceBound ? "source-bound" : "run", preparation && (() => ({
			...preparation,
			compatAssertCurrent: assertCurrent
		})), legacy)
	};
	if (sourceBound) {
		assertCurrent();
		return;
	}
	const injection = backend.messageInjection;
	if (!injection && !backend.queueMessage) return;
	return {
		claimPendingUserInputAnswer: backend.claimPendingUserInputAnswer?.bind(backend),
		cancelPendingUserInput: backend.cancelPendingUserInput?.bind(backend),
		prepareQueueMessage: legacy?.prepareQueueMessage,
		isAvailable: () => {
			return injection ? injection.isAvailable() : !backend.isStopped?.();
		},
		queueMessage: (text, options) => {
			legacy?.assertQueueCurrent();
			assertCurrent();
			if (injection) return injection.queueMessage(text, options);
			return options ? backend.queueMessage(text, options) : backend.queueMessage(text);
		}
	};
}
function resolveReplyMessageInjectionRejection(params) {
	const { operation } = params;
	if (!operation || replyRunState.activeRunsByKey.get(operation.key) !== operation) return { reason: "no_active_run" };
	if (operation.result || operation.phase !== "running") return { reason: "not_running" };
	if (isReplyRunEvidenceStale(operation)) return { reason: "stale_run" };
	const backend = getAttachedBackend(operation);
	const canInject = () => replyRunState.activeRunsByKey.get(operation.key) === operation && !operation.result && operation.phase === "running" && getAttachedBackend(operation) === backend;
	return resolveReplyBackendMessageInjectionRejection({
		...params,
		sessionId: operation.sessionId,
		backend,
		canInject,
		toolAuthorityFingerprint: operation.toolAuthorityFingerprint,
		personalToolParticipants: operation.personalToolParticipants
	});
}
/** The source and concrete execution owner compose their authority at the same V2 sink. */
function resolveReplyBackendMessageInjectionRejection(params) {
	const { backend } = params;
	const canInject = () => {
		params.preparation?.compatAssertCurrent();
		params.assertCurrent?.();
		return params.canInject();
	};
	const injection = backend ? resolveReplyBackendMessageInjection(backend, canInject, params.assertCurrent !== void 0, params.preparation && {
		...params.preparation,
		assertCurrent: createMessageInjectionAuthority(() => {
			params.preparation.assertCurrent();
			params.assertCurrent?.();
			return params.canInject();
		})
	}) : void 0;
	if (!backend || !injection) return { reason: "injection_unavailable" };
	try {
		const compactionAllowsSteering = canSteerEmbeddedRunDuringCompaction(params.sessionId, backend);
		if (!injection.isAvailable() || !compactionAllowsSteering) return { reason: "injection_unavailable" };
	} catch (error) {
		return {
			reason: "injection_unavailable",
			errorMessage: String(error)
		};
	}
	if (backend.supportsCrossProfileSteering === false && params.options?.isInboundUserMessage === true && params.personalToolParticipant?.operatorAuthority && params.personalToolParticipant.operatorAuthority.profileId !== params.personalToolParticipants?.resolve(void 0, { allowTurnOwner: () => true })?.profileId) return {
		reason: "tool_authority_mismatch",
		backend
	};
	const mismatch = resolveReplyBackendQueueMessageMismatch(backend, params.options, params);
	const activeFingerprint = normalizeOptionalString(backend.toolAuthorityFingerprint ?? params.toolAuthorityFingerprint);
	const toolAuthorityMatched = activeFingerprint !== void 0 && normalizeOptionalString(params.options?.toolAuthorityFingerprint) === activeFingerprint;
	const pendingInputAuthorityProven = activeFingerprint !== void 0 && normalizeOptionalString(params.options?.pendingInputAuthorityFingerprint) === activeFingerprint;
	const hiddenPendingInputAuthorized = mismatch === "input_visibility_mismatch" && params.options?.isInboundUserMessage === true && backend.messageInjectionV2?.version === 2 && activeFingerprint !== void 0 && (pendingInputAuthorityProven || toolAuthorityMatched);
	if ((mismatch === "tool_authority_mismatch" && pendingInputAuthorityProven || hiddenPendingInputAuthorized) && params.allowPendingUserInputAnswer !== false && !hasPromptImageInput(params.options) && injection.claimPendingUserInputAnswer) return {
		backend,
		injection: {
			isAvailable: () => true,
			queueMessage: async (text, options) => {
				if (!await injection.claimPendingUserInputAnswer?.(text, options)) throw new Error("pending user input was not accepted");
				options?.onQueueAccepted?.(true);
				options?.onQueueSettled?.();
			}
		}
	};
	return mismatch ? {
		reason: mismatch,
		backend,
		cancelPendingUserInput: mismatch !== "input_visibility_mismatch" || hiddenPendingInputAuthorized ? injection.cancelPendingUserInput : void 0
	} : {
		backend,
		injection,
		prepareQueueMessage: injection.prepareQueueMessage
	};
}
function resolveReplyMessageInjectionFailure(error, params) {
	const { assertCurrent, accepted } = params;
	const candidates = collectErrorGraphCandidates(error, readErrorCauses);
	const unsupported = candidates.findLast((candidate) => candidate instanceof QuestionDispatchUnsupportedError);
	const unconfirmed = candidates.findLast((candidate) => candidate instanceof QuestionAnswerUnconfirmedError || candidate instanceof MessageInjectionAcceptedUnconfirmedError);
	if (unconfirmed) return {
		status: "indeterminate",
		errorMessage: unconfirmed.message
	};
	if (accepted && !candidates.some((candidate) => candidate instanceof MessageInjectionWithdrawnError)) {
		const sourceRefusal = candidates.findLast((candidate) => candidate instanceof MessageInjectionAuthorityError);
		const completionError = sourceRefusal?.cause instanceof Error ? sourceRefusal.cause : error;
		return {
			status: "indeterminate",
			errorMessage: toErrorObject(completionError, "Message injection completion failed").message
		};
	}
	const rejectUnavailable = () => {
		try {
			assertCurrent?.();
		} catch (sourceError) {
			return {
				status: "failed",
				error: toErrorObject(sourceError, "Message source authority is no longer current")
			};
		}
		return {
			status: "rejected",
			reason: "injection_unavailable"
		};
	};
	if (candidates.findLast((candidate) => candidate instanceof MessageInjectionTargetUnavailableError)) return rejectUnavailable();
	const refusal = candidates.findLast((candidate) => candidate instanceof MessageInjectionAuthorityError || (assertCurrent !== void 0 || unsupported !== void 0) && (candidate instanceof QuestionDispatchRefusedError && !(candidate instanceof QuestionDispatchUnsupportedError) || candidate instanceof SessionPendingInputCustodyError));
	if (unsupported && !refusal) return rejectUnavailable();
	const authorityError = refusal ?? unsupported;
	if (authorityError instanceof Error) return {
		status: "failed",
		error: authorityError instanceof MessageInjectionAuthorityError && authorityError.cause instanceof Error ? authorityError.cause : authorityError
	};
}
function beginReplyMessageInjectionTarget(target, text, options) {
	return enqueueMessageInjection(target[replyMessageInjectionTargetOwner].backendIdentity, () => beginPreparedReplyMessageInjectionTarget(target, text, options));
}
async function beginPreparedReplyMessageInjectionTarget(target, text, options) {
	const owner = target[replyMessageInjectionTargetOwner];
	const { canAdmit, toolAuthorityOverlay, toolAuthorityPreparation, personalToolParticipant, assertCurrent, allowPendingUserInputAnswer, inboundAudio, ...backendOptions } = options ?? {};
	const assertSourceCurrent = toolAuthorityPreparation || assertCurrent ? () => {
		toolAuthorityPreparation?.assertCurrent();
		assertCurrent?.();
	} : void 0;
	const resolvePreAcceptanceFailure = (error) => {
		const failure = resolveReplyMessageInjectionFailure(error, {
			assertCurrent: assertSourceCurrent,
			accepted: false
		});
		if (!failure) throw error;
		return failure;
	};
	try {
		await toolAuthorityPreparation?.prepareCurrent();
	} catch (error) {
		const failure = resolvePreAcceptanceFailure(error);
		return {
			targetRunId: target.runId,
			acceptance: Promise.resolve(false),
			outcome: Promise.resolve(failure)
		};
	}
	const projectedToolAuthorityFingerprint = toolAuthorityOverlay ? await owner.projectToolAuthorityFingerprintAsync(toolAuthorityOverlay) : backendOptions.toolAuthorityFingerprint;
	const sourceBound = assertCurrent !== void 0 || toolAuthorityPreparation !== void 0 && toolAuthorityPreparation.authorityKind !== "run";
	assertSourceCurrent?.();
	const assertPolicy = (projected) => {
		assertSourceCurrent?.();
		if (!projected || projected !== projectedToolAuthorityFingerprint) throw new MessageInjectionAuthorityError();
	};
	const queueOptions = options ? {
		...backendOptions,
		...toolAuthorityOverlay ? { toolAuthorityFingerprint: projectedToolAuthorityFingerprint } : {}
	} : void 0;
	const resolved = canAdmit?.() === false ? { reason: "injection_unavailable" } : owner.resolve({
		options: queueOptions,
		personalToolParticipant: toolAuthorityOverlay ?? personalToolParticipant,
		inboundAudio,
		allowPendingUserInputAnswer,
		assertCurrent: sourceBound ? assertSourceCurrent : void 0,
		preparation: toolAuthorityOverlay ? bindPreparedToolAuthority(bindWorkerToolPreparation({
			assertCurrent: () => assertSourceCurrent?.(),
			compatAssertCurrent: () => {
				toolAuthorityPreparation?.compatAssertCurrent();
				assertPolicy(owner.projectToolAuthorityFingerprint(toolAuthorityOverlay));
			},
			prepareCurrent: async () => {
				await toolAuthorityPreparation?.prepareCurrent();
				assertPolicy(await owner.projectToolAuthorityFingerprintAsync(toolAuthorityOverlay));
			}
		}, toolAuthorityPreparation ? [toolAuthorityPreparation] : [])) : toolAuthorityPreparation
	});
	if (!("injection" in resolved)) {
		const immediateRejection = {
			status: "rejected",
			reason: resolved.reason,
			...resolved.errorMessage ? { errorMessage: resolved.errorMessage } : {}
		};
		const cancelPendingImage = options?.isInboundUserMessage === true && hasPromptImageInput(options) && (resolved.reason === "tool_authority_mismatch" || resolved.reason === "input_visibility_mismatch" || resolved.reason === "image_input_unsupported") ? resolved.cancelPendingUserInput : void 0;
		let outcome = Promise.resolve(immediateRejection);
		if (cancelPendingImage) try {
			outcome = Promise.resolve(cancelPendingImage("image-reply")).then(() => immediateRejection, resolvePreAcceptanceFailure);
		} catch (error) {
			outcome = Promise.resolve(resolvePreAcceptanceFailure(error));
		}
		return {
			targetRunId: target.runId,
			acceptance: outcome.then((result) => result.status === "indeterminate", () => false),
			outcome
		};
	}
	const targetRunId = normalizeOptionalString(resolved.backend.runId);
	const userTurnTranscriptRecorder = queueOptions?.userTurnTranscriptRecorder;
	const acceptance = createDeferredCore();
	let acceptanceSettled = false;
	let queueAccepted = false;
	let participantRecorded = false;
	const recordParticipant = () => {
		const participant = toolAuthorityOverlay ?? personalToolParticipant;
		if (!participantRecorded && queueOptions?.isInboundUserMessage && participant) {
			participantRecorded = true;
			owner.acceptParticipant?.(participant);
		}
	};
	const settleAcceptance = (accepted) => {
		if (acceptanceSettled) return;
		acceptanceSettled = true;
		acceptance.resolve(accepted);
		queueOptions?.onQueueAccepted?.(accepted);
	};
	const runtimeQueueOptions = {
		...queueOptions,
		...allowPendingUserInputAnswer === false ? { isInboundUserMessage: false } : {},
		onQueueAccepted: (accepted) => {
			if (accepted) {
				queueAccepted = true;
				recordParticipant();
				settleAcceptance(true);
			}
		}
	};
	const failed = (error) => {
		const outcome = resolveReplyMessageInjectionFailure(error, {
			assertCurrent: assertSourceCurrent,
			accepted: queueAccepted
		}) ?? {
			status: "rejected",
			reason: "runtime_rejected",
			errorMessage: String(error)
		};
		settleAcceptance(outcome.status === "indeterminate");
		return outcome;
	};
	let queued;
	try {
		if (resolved.prepareQueueMessage) await resolved.prepareQueueMessage();
		queued = resolved.injection.queueMessage(text, runtimeQueueOptions);
	} catch (error) {
		return {
			targetRunId,
			acceptance: acceptance.promise,
			outcome: Promise.resolve(failed(error))
		};
	}
	const outcome = queued.then(async (result) => {
		queueAccepted = true;
		recordParticipant();
		settleAcceptance(true);
		if (result?.transcriptCommit === "unconfirmed") return {
			status: "indeterminate",
			errorMessage: result.errorMessage
		};
		if (targetRunId && queueOptions?.waitForTranscriptCommit === true) await userTurnTranscriptRecorder?.confirmSteerTargetRunIdForPersistence?.(targetRunId);
		return { status: "accepted" };
	}).catch(failed);
	return {
		targetRunId,
		acceptance: acceptance.promise,
		outcome
	};
}
/** Finalize adoption and cleanup on the captured owner without rediscovery. */
async function finalizeReplyMessageInjectionAttempt(params) {
	const outcome = await params.attempt.outcome;
	if (outcome.status === "failed") throw outcome.error;
	if (outcome.status === "rejected") return {
		status: "rejected",
		outcome,
		targetRunId: params.attempt.targetRunId
	};
	params.onOutcome?.(outcome.status);
	const accepted = outcome.status === "accepted";
	const owner = accepted ? params.target[replyMessageInjectionTargetOwner] : void 0;
	owner?.recordAccepted({ inboundAudio: params.inboundAudio });
	let aborted = false;
	let adoptionError;
	try {
		await params.onAdopted?.();
	} catch (error) {
		adoptionError = error;
		if (owner && params.shouldAbortOnAdoptionError?.(error)) {
			owner.abort();
			aborted = true;
		}
	}
	if (!accepted) return {
		status: "indeterminate",
		outcome,
		targetRunId: params.attempt.targetRunId,
		adoptionError
	};
	return {
		status: "accepted",
		outcome,
		targetRunId: params.attempt.targetRunId,
		aborted,
		...adoptionError === void 0 ? {} : { adoptionError }
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/message-injection-target.ts
/** Capture a direct command's existing admitted owner, never authority from a session ID. */
function captureDirectEmbeddedMessageInjectionTarget(sessionKey, allowsDirectOwner) {
	const sessionId = ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.get(sessionKey);
	const handle = sessionId ? ACTIVE_EMBEDDED_RUNS.get(sessionId) : void 0;
	const registration = handle && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle);
	const toolAuthority = registration?.toolAuthority;
	const instance = registration?.operationalRunInstance;
	const delegatedAuthority = registration?.delegatedAuthority;
	if (!sessionId || !handle || toolAuthority?.source !== "attempt") return;
	if (!registration || registration.sessionKey !== sessionKey || registration.sessionId !== sessionId || !instance || instance.runId !== handle.runId || !delegatedAuthority) {
		diagnosticLogger.debug("direct steering unavailable", {
			reason: "admitted-injection-capability-unavailable",
			sessionKey,
			sessionId,
			runId: handle.runId
		});
		return;
	}
	const runId = instance.runId;
	const injection = handle.messageInjectionV2;
	const ownsRegistration = () => ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.get(sessionKey) === sessionId && ACTIVE_EMBEDDED_RUNS.get(sessionId) === handle && ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(runId) === handle && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) === registration && registration.operationalRunInstance === instance && handle.messageInjectionV2 === injection;
	const canInject = () => {
		toolAuthority.assertActive();
		return ownsRegistration() && allowsDirectOwner() && getActiveAgentRunDelegatedAuthority(instance) === delegatedAuthority && validateAgentRunDelegatedAuthority(delegatedAuthority) && !handle.isAborted?.() && !handle.isStopped?.() && ownsRegistration() && allowsDirectOwner();
	};
	try {
		if (!canInject()) return;
	} catch {
		return;
	}
	const backend = {
		...handle,
		kind: "embedded",
		cancel: (reason) => handle.cancel ? handle.cancel(reason) : handle.abort(reason === "restart" ? reason : void 0)
	};
	return {
		runId,
		sourceTurnId: toolAuthority.sourceTurnId,
		[replyMessageInjectionTargetOwner]: {
			backendIdentity: handle,
			acceptParticipant: (overlay) => toolAuthority.personalToolParticipants?.accept(overlay),
			projectToolAuthorityFingerprint: (overlay) => {
				try {
					return canInject() ? toolAuthority.project({
						...overlay,
						traceAuthorized: false
					}) : void 0;
				} catch {
					return;
				}
			},
			projectToolAuthorityFingerprintAsync: async (overlay) => {
				try {
					if (!canInject()) return;
					const projected = await toolAuthority.projectAsync({
						...overlay,
						traceAuthorized: false
					});
					return canInject() ? projected : void 0;
				} catch {
					return;
				}
			},
			resolve: (params) => {
				const reject = (reason) => {
					diagnosticLogger.info("direct steering rejected; keeping input for followup", {
						reason,
						runId,
						sessionKey,
						sessionId
					});
					return { reason };
				};
				try {
					if (!canInject()) return reject("no_active_run");
				} catch {
					return reject("no_active_run");
				}
				if (injection?.version !== 2 || handle.supportsTranscriptCommitWait !== true) return reject("injection_unavailable");
				const blocker = resolveActiveEmbeddedRunRecoveryBlocker(sessionId, handle);
				const activity = getDiagnosticSessionActivitySnapshot({ sessionId });
				if (typeof activity.lastProgressAgeMs === "number" && activity.lastProgressAgeMs > resolveRunStaleThresholdMs(activity) && !blocker) return reject("stale_run");
				if (params.inboundAudio || hasInboundAudio({ media: params.options?.media })) return reject("audio_input_unsupported");
				const resolved = resolveReplyBackendMessageInjectionRejection({
					...params,
					sessionId,
					backend,
					canInject,
					personalToolParticipants: toolAuthority.personalToolParticipants,
					options: params.options?.isInboundUserMessage && params.allowPendingUserInputAnswer !== false ? {
						...params.options,
						terminalReplyExpectation: "required"
					} : params.options
				});
				if (!("injection" in resolved)) reject(resolved.reason);
				return resolved;
			},
			recordAccepted: () => {
				if (ownsRegistration()) logMessageQueuedWithBacklogPolicy({
					sessionId,
					source: "embedded-agent-runner"
				}, false);
			},
			abort: () => {
				try {
					if (!canInject() || !isEmbeddedRunHandleAbortable(sessionId, handle) || !canInject()) return false;
					backend.cancel("user_abort");
					return true;
				} catch (error) {
					diagnosticLogger.warn("direct steering target could not be aborted", {
						runId,
						sessionKey,
						error: String(error)
					});
					return false;
				}
			}
		}
	};
}
function createEmbeddedMessageInjectionQueue(consume) {
	return (sessionId, text, options, canInject, sourcePreparation) => {
		const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
		const registration = handle && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle);
		const runId = handle?.runId;
		const assertCurrent = createMessageInjectionAuthority(() => {
			registration?.toolAuthority?.assertActive();
			return ACTIVE_EMBEDDED_RUNS.get(sessionId) === handle && (!handle || ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) === registration && handle.runId === runId);
		});
		const admitted = (release) => consume(sessionId, text, options, canInject, sourcePreparation, release, assertCurrent);
		return handle ? enqueueMessageInjection(handle, admitted) : admitted(() => {});
	};
}
async function prepareEmbeddedInjectionAuthority(sessionId, options, canInject, sourcePreparation) {
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	if (!handle) return;
	const registration = ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle);
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	const ownedOperation = operation && getAttachedBackend(operation) === handle ? operation : void 0;
	const assertCurrent = createMessageInjectionAuthority(() => {
		sourcePreparation?.assertCurrent();
		registration?.toolAuthority?.assertActive();
		return (!canInject || canInject()) && ACTIVE_EMBEDDED_RUNS.get(sessionId) === handle && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) === registration && (!ownedOperation || resolveReplyRunForCurrentSessionId(sessionId) === ownedOperation && getAttachedBackend(ownedOperation) === handle);
	});
	const project = async () => {
		assertCurrent();
		await sourcePreparation?.prepareCurrent();
		const overlay = options?.toolAuthorityOverlay;
		const fingerprint = overlay ? await (registration?.toolAuthority ? registration.toolAuthority.projectAsync(overlay) : ownedOperation?.projectToolAuthorityFingerprintAsync(overlay))?.catch(() => void 0) : options?.toolAuthorityFingerprint;
		assertCurrent();
		return fingerprint;
	};
	const fingerprint = await project();
	return {
		fingerprint,
		preparation: bindWorkerToolPreparation({
			assertCurrent,
			compatAssertCurrent: () => {
				assertCurrent();
				sourcePreparation?.compatAssertCurrent?.();
				const overlay = options?.toolAuthorityOverlay;
				if ((overlay ? registration?.toolAuthority ? registration.toolAuthority.project(overlay) : ownedOperation?.projectToolAuthorityFingerprint(overlay) : options?.toolAuthorityFingerprint) !== fingerprint) throw new Error("Queued caller tool authority changed during preparation");
				assertCurrent();
			},
			prepareCurrent: async () => {
				if (await project() !== fingerprint) throw new Error("Queued caller tool authority changed during preparation");
			}
		}, sourcePreparation ? [sourcePreparation] : [])
	};
}
function bindEmbeddedMessageInjection(sessionId, handle, guarded, sourceCanInject, preparation, options) {
	const registration = ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle);
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	const ownedOperation = operation && getAttachedBackend(operation) === handle ? operation : void 0;
	const assertCurrent = createMessageInjectionAuthority(() => {
		options?.assertCurrent?.();
		preparation?.assertCurrent();
		preparation?.compatAssertCurrent?.();
		if (sourceCanInject && !sourceCanInject()) return false;
		const overlay = options?.toolAuthorityOverlay;
		if (overlay) {
			const projected = registration?.toolAuthority ? registration.toolAuthority.project(overlay) : ownedOperation?.projectToolAuthorityFingerprint(overlay);
			if (!projected || projected !== (handle.toolAuthorityFingerprint ?? ownedOperation?.toolAuthorityFingerprint)) return false;
		}
		registration?.toolAuthority?.assertActive();
		return ACTIVE_EMBEDDED_RUNS.get(sessionId) === handle && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) === registration && (!ownedOperation || resolveReplyRunForCurrentSessionId(sessionId) === ownedOperation && getAttachedBackend(ownedOperation) === handle);
	});
	const authorityKind = sourceCanInject ? "source-bound" : "run";
	const prepared = preparation && bindPreparedToolAuthority({
		...preparation,
		assertCurrent,
		compatAssertCurrent: assertCurrent
	});
	const legacy = prepared && !guarded.queueMessageAsync ? createLegacyToolAuthorityQueuePreflight(prepared) : void 0;
	return guarded.isAvailable() ? bindMessageInjectionV2(guarded, assertCurrent, authorityKind, prepared && (() => prepared), legacy) : void 0;
}
function resolveEmbeddedInjection(sessionId, handle, sourceCanInject, preparation, injectionOptions) {
	try {
		const guarded = handle.messageInjectionV2;
		if (guarded?.version === 2) return bindEmbeddedMessageInjection(sessionId, handle, guarded, sourceCanInject, preparation, injectionOptions);
		if (sourceCanInject) return;
		const legacy = preparation && createLegacyToolAuthorityQueuePreflight({
			...preparation,
			compatAssertCurrent: preparation.compatAssertCurrent ?? preparation.assertCurrent
		});
		const injection = handle.messageInjection;
		const isAvailable = injection ? injection.isAvailable() : handle.isStopped ? !handle.isStopped() : handle.isStreaming();
		const target = injection || handle;
		return isAvailable ? {
			prepareQueueMessage: legacy?.prepareQueueMessage,
			queueMessage: (text, options) => {
				legacy?.assertQueueCurrent();
				injectionOptions?.assertCurrent?.();
				return target.queueMessage(text, options);
			},
			claimPendingUserInputAnswer: handle.claimPendingUserInputAnswer?.bind(handle),
			cancelPendingUserInput: handle.cancelPendingUserInput?.bind(handle)
		} : void 0;
	} catch (err) {
		diagnosticLogger.warn(`queue message failed: sessionId=${sessionId} reason=injectable_check_failed err=${String(err)}`);
		return;
	}
}
//#endregion
//#region src/auto-reply/reply/reply-run-finalization-lease.ts
const REPLY_RUN_FINALIZATION_SETTLE_TIMEOUT_MS = 6e4;
function formatReplyOperationResult(result) {
	if (!result) return "none";
	return "code" in result ? `${result.kind}:${result.code}` : result.kind;
}
const activeSettleTimers = /* @__PURE__ */ new Set();
const leasesByOwner = /* @__PURE__ */ new WeakMap();
function createReplyRunSettleTimer(params) {
	let timer;
	const settleTimer = {
		clear() {
			clearTimeout(timer);
			timer = void 0;
			activeSettleTimers.delete(settleTimer);
		},
		renew(timeoutMs) {
			settleTimer.clear();
			timer = setTimeout(() => {
				timer = void 0;
				activeSettleTimers.delete(settleTimer);
				if (params.canExpire()) params.onExpire();
			}, resolveTimerTimeoutMs(timeoutMs, REPLY_RUN_FINALIZATION_SETTLE_TIMEOUT_MS, 1));
			timer.unref?.();
			activeSettleTimers.add(settleTimer);
		},
		scheduleOnce(timeoutMs) {
			if (!timer) settleTimer.renew(timeoutMs);
		}
	};
	return settleTimer;
}
function createReplyRunFinalizationLease(params) {
	let finalizing = false;
	let defaultDeadlineMs = 0;
	let workDeadlineMs = 0;
	let activeWork = 0;
	const settleTimer = createReplyRunSettleTimer({
		canExpire: () => finalizing && params.canExpire(),
		onExpire: params.onExpire
	});
	const schedule = () => {
		const deadlineMs = Math.max(defaultDeadlineMs, workDeadlineMs);
		settleTimer.renew(Math.max(1, deadlineMs - Date.now()));
	};
	const recordActivity = () => {
		params.onActivity();
		if (finalizing) {
			defaultDeadlineMs = Date.now() + REPLY_RUN_FINALIZATION_SETTLE_TIMEOUT_MS;
			params.onFinalizationProgress();
			schedule();
		}
	};
	const lease = {
		begin() {
			if (!params.canExpire()) return;
			finalizing = true;
			recordActivity();
		},
		beginWork(timeoutMs) {
			activeWork += 1;
			workDeadlineMs = Math.max(workDeadlineMs, Date.now() + resolveTimerTimeoutMs(timeoutMs, REPLY_RUN_FINALIZATION_SETTLE_TIMEOUT_MS, 1));
			recordActivity();
			return () => {
				activeWork -= 1;
				if (activeWork <= 0) {
					activeWork = 0;
					workDeadlineMs = 0;
				}
				if (finalizing) schedule();
			};
		},
		clear() {
			finalizing = false;
			defaultDeadlineMs = 0;
			workDeadlineMs = 0;
			activeWork = 0;
			settleTimer.clear();
			leasesByOwner.delete(params.owner);
		},
		recordActivity
	};
	leasesByOwner.set(params.owner, lease);
	return lease;
}
function beginReplyOperationFinalizationWork(owner, timeoutMs) {
	return leasesByOwner.get(owner)?.beginWork(timeoutMs) ?? (() => void 0);
}
function resetReplyRunSettleTimersForTesting() {
	for (const timer of activeSettleTimers) timer.clear();
}
//#endregion
//#region src/auto-reply/reply/reply-run-registry.tool-authority.ts
/** Personal targets belong to the admitted turn, independently of its concrete backend attempts. */
function createReplyTurnParticipants(owner) {
	const participants = /* @__PURE__ */ new Map();
	const releases = /* @__PURE__ */ new Map();
	let closed = false;
	const add = (input) => {
		const authority = input.operatorAuthority;
		if (!authority) return;
		assertAdmittedRunOperatorAuthority(authority);
		const senderId = input.senderId ?? authority.profileId;
		const name = input.senderName ?? senderId;
		let retentionFailed = false;
		try {
			const release = authority.retain?.();
			releases.get(authority.profileId)?.();
			releases.delete(authority.profileId);
			if (release) releases.set(authority.profileId, release);
		} catch {
			retentionFailed = true;
		}
		participants.set(authority.profileId, Object.freeze({
			profileId: authority.profileId,
			senderId,
			name,
			operatorAuthority: authority,
			gatewayUiCommandTarget: input.gatewayUiCommandTarget ? Object.freeze({ ...input.gatewayUiCommandTarget }) : void 0,
			assertCurrent: () => {
				if (closed) throw new Error("This turn has ended; ask again in a new turn.");
				try {
					if (retentionFailed) throw new Error("Participant authority could not be retained");
					authority.assertCurrent();
				} catch {
					throw new Error(`${name}'s access changed; ask them again`);
				}
			}
		}));
	};
	if (owner) add(owner);
	function resolve(user, options) {
		if (closed) throw new Error("This turn has ended; ask again in a new turn.");
		const people = [...participants.values()];
		const choices = people.map((person) => `${person.name} (user: ${person.profileId})`).join(", ");
		if (user === void 0 && people.length > 1 && !options?.allowTurnOwner?.()) throw new Error(`Several people have steered this turn: ${choices}. Pass the requester's requester_profile.id as user, or ask them if unclear.`);
		const person = user === void 0 ? people[0] : people.find((candidate) => candidate.profileId === user);
		if (user !== void 0 && !person) throw new Error(`User is not a participant of this turn.${choices ? ` Choose ${choices}.` : " Ask again from your signed-in Control UI."}`);
		person?.assertCurrent();
		return person ? {
			...person,
			assertCurrent: () => {
				if (user === void 0 && participants.size > 1) resolve(user, options);
				person.assertCurrent();
			}
		} : void 0;
	}
	return {
		accept(overlay) {
			if (!closed && owner?.operatorAuthority && overlay.operatorAuthority?.profileId !== owner.operatorAuthority.profileId) add(overlay);
		},
		resolve,
		close() {
			if (closed) return;
			closed = true;
			participants.clear();
			for (const release of releases.values()) release();
			releases.clear();
		}
	};
}
function normalizeToolAuthorityRoute(value) {
	const provider = normalizeOptionalString(value.provider);
	const model = normalizeOptionalString(value.model);
	if (!provider || !model) throw new Error("Reply operation tool authority route is required");
	return {
		provider,
		model
	};
}
/** Owns frozen policy, concrete attempt routing, and backend authority for one operation. */
function createReplyOperationToolAuthority(lifecycle) {
	let fingerprint;
	let snapshot;
	let route;
	let automaticFallbackRoute;
	let participants;
	const canInstallSnapshot = (value) => {
		if (!lifecycle.isOpen() || snapshot && snapshot !== value) throw new Error("Reply operation cannot change tool authority after admission");
		return !snapshot;
	};
	function installSnapshot(value, prepared) {
		if (!canInstallSnapshot(value)) return;
		const initialFingerprint = normalizeOptionalString(prepared);
		if (!initialFingerprint) throw new Error("Reply operation tool authority fingerprint is required");
		snapshot = value;
		fingerprint = initialFingerprint;
		participants = createReplyTurnParticipants(value.personalToolOwner);
	}
	const result = {
		get personalToolParticipants() {
			return participants;
		},
		close() {
			snapshot?.close?.();
			participants?.close();
		},
		get toolAuthorityFingerprint() {
			return fingerprint;
		},
		get toolAuthorityRoute() {
			return route;
		},
		get requestedToolAuthorityRoute() {
			return snapshot?.requestedRoute;
		},
		get automaticFallbackRoute() {
			return automaticFallbackRoute;
		},
		bindBackendFingerprint(value) {
			const backendFingerprint = normalizeOptionalString(value);
			if (lifecycle.isOpen() && backendFingerprint) fingerprint = backendFingerprint;
		},
		setAutomaticFallbackRoute(value) {
			if (lifecycle.isOpen() && lifecycle.ownsRunSlot()) automaticFallbackRoute = value ? Object.freeze({ ...value }) : void 0;
		},
		bindToolAuthoritySnapshot(value) {
			warnPluginSdkDeprecation({
				family: "reply-tool-authority-sync-preparation",
				method: "replyOperation.bindToolAuthoritySnapshot",
				replacement: "await bindToolAuthoritySnapshotAsync()"
			});
			if (canInstallSnapshot(value)) installSnapshot(value, value.fingerprint());
		},
		async bindToolAuthoritySnapshotAsync(value) {
			const assertCurrent = lifecycle.captureCurrent();
			if (snapshot === value) return;
			if (snapshot) throw new Error("Reply operation cannot change tool authority after admission");
			try {
				if (!value.fingerprintAsync) warnPluginSdkDeprecation({
					family: "reply-tool-authority-sync-preparation",
					method: "ReplyToolAuthoritySnapshot.fingerprint",
					replacement: "implement fingerprintAsync() and projectAsync()"
				});
				const prepared = await (value.fingerprintAsync?.() ?? value.fingerprint());
				assertCurrent();
				installSnapshot(value, prepared);
			} catch (error) {
				value.close?.();
				throw error;
			}
		},
		projectToolAuthorityFingerprint(overlay) {
			warnPluginSdkDeprecation({
				family: "reply-tool-authority-sync-preparation",
				method: "replyOperation.projectToolAuthorityFingerprint",
				replacement: "await projectToolAuthorityFingerprintAsync()"
			});
			if (!lifecycle.isOpen() || !snapshot || !route) return;
			try {
				return normalizeOptionalString(snapshot.project(overlay, route));
			} catch {
				return;
			}
		},
		async projectToolAuthorityFingerprintAsync(overlay) {
			if (!lifecycle.isOpen() || !snapshot || !route) return;
			const selected = snapshot;
			const selectedRoute = route;
			const admittedFingerprint = fingerprint;
			try {
				const assertOwner = lifecycle.captureCurrent();
				const assertCurrent = () => {
					assertOwner();
					if (snapshot !== selected || route !== selectedRoute || fingerprint !== admittedFingerprint) throw new Error("Reply tool authority route changed during preparation");
				};
				const prepared = await prepareReplyToolAuthorityCallerRead(selected.projectAsync, overlay, admittedFingerprint, selectedRoute, assertCurrent);
				if (prepared) {
					await prepared.prepareCurrent();
					assertCurrent();
					return admittedFingerprint;
				}
				if (!selected.fingerprintAsync || !selected.projectAsync) warnPluginSdkDeprecation({
					family: "reply-tool-authority-sync-preparation",
					method: "ReplyToolAuthoritySnapshot.fingerprint/project",
					replacement: "implement fingerprintAsync() and projectAsync()"
				});
				const current = await (selected.fingerprintAsync?.(selectedRoute) ?? selected.fingerprint(selectedRoute));
				assertCurrent();
				const projected = await (selected.projectAsync?.(overlay, selectedRoute) ?? selected.project(overlay, selectedRoute));
				assertCurrent();
				return current === admittedFingerprint ? normalizeOptionalString(projected) : void 0;
			} catch {
				return;
			}
		},
		bindToolAuthorityRoute(value) {
			warnPluginSdkDeprecation({
				family: "reply-tool-authority-sync-preparation",
				method: "replyOperation.bindToolAuthorityRoute",
				replacement: "await bindToolAuthorityRouteAsync()"
			});
			if (!lifecycle.isOpen() || !snapshot || !lifecycle.ownsRunSlot()) throw new Error("Reply operation has no active tool authority snapshot");
			const preparedRoute = normalizeToolAuthorityRoute(value);
			const preparedFingerprint = snapshot.fingerprint(preparedRoute);
			route = preparedRoute;
			fingerprint = preparedFingerprint;
			return fingerprint;
		},
		async bindToolAuthorityRouteAsync(value) {
			const assertCurrent = lifecycle.captureCurrent();
			const selected = snapshot;
			const previousRoute = route;
			if (!selected || !lifecycle.ownsRunSlot()) throw new Error("Reply operation has no active tool authority snapshot");
			const preparedRoute = normalizeToolAuthorityRoute(value);
			if (!selected.fingerprintAsync) warnPluginSdkDeprecation({
				family: "reply-tool-authority-sync-preparation",
				method: "ReplyToolAuthoritySnapshot.fingerprint",
				replacement: "implement fingerprintAsync() and projectAsync()"
			});
			const prepared = await (selected.fingerprintAsync?.(preparedRoute) ?? selected.fingerprint(preparedRoute));
			assertCurrent();
			if (snapshot !== selected || route !== previousRoute) throw new Error("Reply operation tool authority changed during preparation");
			route = preparedRoute;
			fingerprint = prepared;
			return prepared;
		}
	};
	bindReplyToolAuthorityCallerRead(result.projectToolAuthorityFingerprintAsync, async (caller, expected, _route, assertActive) => {
		const selected = snapshot;
		const selectedRoute = route;
		const assertOwner = lifecycle.captureCurrent();
		const assertCurrent = () => {
			assertActive();
			assertOwner();
			if (!selected || !selectedRoute || snapshot !== selected || route !== selectedRoute || fingerprint !== expected) throw new Error("question creator reply authority is no longer active");
		};
		assertCurrent();
		return await prepareReplyToolAuthorityCallerRead(selected?.projectAsync, caller, expected, selectedRoute, assertCurrent);
	});
	return result;
}
//#endregion
//#region src/auto-reply/reply/reply-run-registry.operation.ts
const REPLY_OPERATION_ABORT_CODES = {
	user_abort: "aborted_by_user",
	restart: "aborted_for_restart",
	superseded: "aborted_for_supersession"
};
function createReplyOperation(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const sessionId = normalizeOptionalString(params.sessionId);
	if (!sessionKey) throw new Error("Reply operations require a canonical sessionKey");
	if (!sessionId) throw new Error("Reply operations require a sessionId");
	if (params.respectFollowupAdmissionBarrier && replyRunState.followupAdmissionBarriersByKey.has(sessionKey)) throw new ReplyRunFollowupAdmissionBlockedError(sessionKey);
	if (replyRunState.activeRunsByKey.has(sessionKey)) throw new ReplyRunAlreadyActiveError(sessionKey);
	if (replyRunState.successorAdmissionBarriersByKey.has(sessionKey)) throw new ReplyRunSuccessorAdmissionBlockedError(sessionKey);
	const controller = new AbortController();
	let currentSessionKey = sessionKey;
	let currentSessionId = sessionId;
	let currentAgentId = resolveReplyOperationAgentId(sessionKey, params.agentId);
	let phase = "queued";
	let phaseBeforeGlobalLaneWait;
	let staleExpiryReason;
	let result = null;
	let stateCleared = false;
	let pendingClearBarrier;
	let retainFailureUntilComplete = false;
	let terminalRecovery = false;
	let acceptedSteeredInboundAudio = false;
	let sourceReplyDelivered = false;
	const toolAuthority = createReplyOperationToolAuthority({
		isOpen: () => result === null,
		ownsRunSlot: () => replyRunState.activeRunsByKey.get(currentSessionKey) === operation,
		captureCurrent: () => {
			const key = currentSessionKey;
			const id = currentSessionId;
			const backend = getAttachedBackend(operation);
			const assertCurrent = () => {
				if (result || controller.signal.aborted || currentSessionKey !== key || currentSessionId !== id || getAttachedBackend(operation) !== backend || replyRunState.activeRunsByKey.get(key) !== operation || getAgentEventLifecycleGeneration() !== lifecycleGeneration) throw new Error("Reply operation tool authority is no longer active");
			};
			assertCurrent();
			return assertCurrent;
		}
	});
	const ownerSettlement = createDeferredCore();
	const producerCompletion = createDeferredCore();
	let producerError;
	let backendReady = createDeferredCore();
	const notifyBackendReady = () => {
		if (phase === "running" && getAttachedBackend(operation)) backendReady.resolve();
	};
	let ownerCompletionBarrier;
	const settleOwner = () => {
		const pending = ownerCompletionBarrier;
		if (!pending) {
			ownerSettlement.resolve(void 0);
			return;
		}
		pending.then(() => pending === ownerCompletionBarrier ? ownerSettlement.resolve(void 0) : settleOwner());
	};
	const startedAtMs = Date.now();
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	let lastActivityAtMs = startedAtMs;
	const upstreamAbortSignal = params.upstreamAbortSignal;
	let upstreamAbortHandler;
	const detachUpstreamAbort = () => {
		if (!upstreamAbortHandler) return;
		upstreamAbortSignal?.removeEventListener("abort", upstreamAbortHandler);
		upstreamAbortHandler = void 0;
	};
	const ownedSessionIds = /* @__PURE__ */ new Set([sessionId]);
	const recordActivity = () => {
		lastActivityAtMs = Date.now();
	};
	const setResult = (next) => {
		result = next;
		toolAuthority.close();
		recordActivity();
		phase = next.kind;
		backendReady.resolve();
		notifyGatewayWorkMetricsChanged();
	};
	const markProgress = (reason) => {
		markDiagnosticRunProgress({
			sessionId: currentSessionId,
			sessionKey: currentSessionKey,
			reason
		});
	};
	const warnForcedRelease = (label, reason) => {
		diagnosticLogger.warn(`reply run ${label}: forced release sessionKey=${currentSessionKey}${reason === void 0 ? "" : ` reason=${reason}`} phase=${phase} result=${formatReplyOperationResult(result)} ageMs=${Date.now() - lastActivityAtMs} ranForMs=${Date.now() - startedAtMs}`);
	};
	const clearState = (afterClearBarrier, followupAdmissionBarrierTimeout) => {
		if (stateCleared) return;
		stateCleared = true;
		backendReady.resolve();
		toolAuthority.close();
		terminalSettleTimer.clear();
		finalizationLease.clear();
		expireReplyOperationByOperation.delete(operation);
		evictReplyOperationByOperation.delete(operation);
		clearReplyOperationByOperation.delete(operation);
		detachUpstreamAbort();
		const registeredBarrier = afterClearBarrier ? registerFollowupAdmissionBarrier(operation, afterClearBarrier, followupAdmissionBarrierTimeout) : pendingClearBarrier;
		pendingClearBarrier = void 0;
		updateFollowupAdmissionSessionId(operation);
		startReplyOperationSuccessorBarriers(operation);
		markProgress("reply_operation:ended");
		clearReplyRunState(operation);
		if (!registeredBarrier) {
			flushReplyOperationAfterClear(operation, currentSessionId);
			return;
		}
		registeredBarrier.settled.then(() => flushReplyOperationAfterClear(operation, registeredBarrier.source.sessionId));
	};
	const scheduleTerminalSettle = () => {
		if (stateCleared) return;
		terminalSettleTimer.scheduleOnce(REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS);
	};
	const complete = (barrier, timeoutMs) => {
		producerCompletion.resolve(producerError);
		if (barrier) {
			const completed = Promise.resolve(barrier).then(() => {}, () => {});
			ownerCompletionBarrier = ownerCompletionBarrier ? Promise.all([ownerCompletionBarrier, completed]).then(() => {}) : completed;
		}
		if (!result) setResult({ kind: "completed" });
		clearState(barrier, timeoutMs);
		settleOwner();
	};
	const abortOperation = (reason, abortReason) => {
		const phaseBeforeAbort = phase;
		if (!result) {
			setResult({
				kind: "aborted",
				code: REPLY_OPERATION_ABORT_CODES[reason]
			});
			detachUpstreamAbort();
		}
		phase = "aborted";
		controller.abort(abortReason);
		try {
			getAttachedBackend(operation)?.cancel(reason);
		} finally {
			if (isReplyOperationPreBackendPhase(phaseBeforeAbort) && !retainStateUntilCompleteOperations.has(operation)) operation.complete();
			else scheduleTerminalSettle();
		}
	};
	const abortIfAllowed = (reason) => {
		if (!isReplyOperationAbortable(operation)) return false;
		abortOperation(reason, reason === "restart" ? createAgentRunRestartAbortError() : createAgentRunDirectAbortError());
		return true;
	};
	const operation = {
		get key() {
			return currentSessionKey;
		},
		get sessionId() {
			return currentSessionId;
		},
		get agentId() {
			return currentAgentId;
		},
		turnKind: params.turnKind ?? "visible",
		lifecycleGeneration,
		get routeThreadId() {
			return params.routeThreadId;
		},
		get originatingLeafEntryId() {
			return params.originatingLeafEntryId;
		},
		abortSignal: controller.signal,
		get resetTriggered() {
			return params.resetTriggered;
		},
		get terminalRecovery() {
			return terminalRecovery;
		},
		get sourceReplyDelivered() {
			return sourceReplyDelivered;
		},
		get acceptedSteeredInboundAudio() {
			return acceptedSteeredInboundAudio;
		},
		get toolAuthorityFingerprint() {
			return toolAuthority.toolAuthorityFingerprint;
		},
		get personalToolParticipants() {
			return toolAuthority.personalToolParticipants;
		},
		get toolAuthorityRoute() {
			return toolAuthority.toolAuthorityRoute;
		},
		get requestedToolAuthorityRoute() {
			return toolAuthority.requestedToolAuthorityRoute;
		},
		get automaticFallbackRoute() {
			return toolAuthority.automaticFallbackRoute;
		},
		setAutomaticFallbackRoute: toolAuthority.setAutomaticFallbackRoute,
		get phase() {
			return phase;
		},
		get result() {
			return result;
		},
		get staleExpiryReason() {
			return staleExpiryReason;
		},
		get startedAtMs() {
			return startedAtMs;
		},
		get lastActivityAtMs() {
			return lastActivityAtMs;
		},
		captureOwnedSessionIds() {
			return new Set(ownedSessionIds);
		},
		recordActivity() {
			finalizationLease.recordActivity();
		},
		setPhase(next) {
			if (result) return;
			recordActivity();
			phase = next;
			notifyBackendReady();
			notifyGatewayWorkMetricsChanged();
		},
		markWaitingForDeferredMaintenance() {
			if (result || phase !== "queued") return;
			phase = "waiting_for_deferred_maintenance";
			notifyGatewayWorkMetricsChanged();
			markProgress("deferred_maintenance:waiting");
		},
		markDeferredMaintenanceWaitEnded() {
			if (result || phase !== "waiting_for_deferred_maintenance") return;
			phase = "queued";
			notifyGatewayWorkMetricsChanged();
			markProgress("deferred_maintenance:wait_ended");
		},
		markWaitingForGlobalLane() {
			if (result || phase !== "queued" && phase !== "running") return;
			phaseBeforeGlobalLaneWait = phase;
			phase = "waiting_for_global_lane";
			notifyGatewayWorkMetricsChanged();
			markProgress("global_lane:waiting");
		},
		markGlobalLaneWaitEnded() {
			if (result || phase !== "waiting_for_global_lane") return;
			phase = phaseBeforeGlobalLaneWait ?? "queued";
			phaseBeforeGlobalLaneWait = void 0;
			notifyBackendReady();
			notifyGatewayWorkMetricsChanged();
			markProgress("global_lane:wait_ended");
		},
		markTerminalRecovery() {
			terminalRecovery = true;
		},
		markSteeredInputAccepted({ inboundAudio }) {
			acceptedSteeredInboundAudio ||= inboundAudio;
			sourceReplyDelivered = false;
		},
		markSourceReplyDelivered() {
			sourceReplyDelivered = true;
		},
		bindToolAuthoritySnapshot: toolAuthority.bindToolAuthoritySnapshot,
		bindToolAuthoritySnapshotAsync: toolAuthority.bindToolAuthoritySnapshotAsync,
		projectToolAuthorityFingerprint: toolAuthority.projectToolAuthorityFingerprint,
		projectToolAuthorityFingerprintAsync: toolAuthority.projectToolAuthorityFingerprintAsync,
		bindToolAuthorityRoute: toolAuthority.bindToolAuthorityRoute,
		bindToolAuthorityRouteAsync: toolAuthority.bindToolAuthorityRouteAsync,
		updateSessionId(nextSessionId) {
			if (result) return;
			const normalizedNextSessionId = normalizeOptionalString(nextSessionId);
			if (!normalizedNextSessionId || normalizedNextSessionId === currentSessionId) return;
			recordActivity();
			if (replyRunState.activeKeysBySessionId.has(normalizedNextSessionId) && replyRunState.activeKeysBySessionId.get(normalizedNextSessionId) !== currentSessionKey) throw new Error(`Cannot rebind reply operation ${currentSessionKey} to active session ${normalizedNextSessionId}`);
			replyRunState.activeKeysBySessionId.delete(currentSessionId);
			replyRunState.waitKeysBySessionId.set(currentSessionId, currentSessionKey);
			currentSessionId = normalizedNextSessionId;
			ownedSessionIds.add(currentSessionId);
			updateFollowupAdmissionSessionId(operation);
			updateSuccessorAdmissionSessionId(operation, currentSessionId);
			replyRunState.activeKeysBySessionId.set(currentSessionId, currentSessionKey);
			replyRunState.waitKeysBySessionId.set(currentSessionId, currentSessionKey);
			notifyGatewayWorkMetricsChanged();
			markProgress("reply_operation:session_updated");
		},
		updateSessionKey(nextSessionKey, agentId) {
			const update = prepareReplyRunKeyUpdate(operation, nextSessionKey, agentId, stateCleared);
			if (!update) return;
			recordActivity();
			currentAgentId = update.agentId;
			if (update.sessionKey === currentSessionKey) {
				notifyGatewayWorkMetricsChanged();
				return;
			}
			const previousKey = currentSessionKey;
			replyRunState.activeRunsByKey.delete(previousKey);
			currentSessionKey = update.sessionKey;
			backendReady.resolve();
			backendReady = createDeferredCore();
			backendReadyByOperation.set(operation, backendReady.promise);
			replyRunState.activeRunsByKey.set(currentSessionKey, operation);
			replyRunState.activeKeysBySessionId.set(currentSessionId, currentSessionKey);
			for (const ownedSessionId of ownedSessionIds) if (replyRunState.waitKeysBySessionId.get(ownedSessionId) === previousKey) replyRunState.waitKeysBySessionId.set(ownedSessionId, currentSessionKey);
			notifyGatewayWorkMetricsChanged();
			notifyReplyRunEnded(previousKey);
			markProgress("reply_operation:session_key_adopted");
		},
		attachBackend(handle) {
			if (result) {
				handle.cancel(result.kind === "aborted" ? result.code === "aborted_for_restart" ? "restart" : result.code === "aborted_for_supersession" ? "superseded" : "user_abort" : "superseded");
				return;
			}
			recordActivity();
			toolAuthority.bindBackendFingerprint(handle.toolAuthorityFingerprint);
			attachedBackendByOperation.set(operation, handle);
			notifyBackendReady();
			if (controller.signal.aborted) handle.cancel("superseded");
		},
		detachBackend(handle) {
			if (getAttachedBackend(operation) === handle) attachedBackendByOperation.delete(operation);
		},
		freezeAbort() {
			abortFrozenOperations.add(operation);
			detachUpstreamAbort();
			finalizationLease.begin();
		},
		retainFailureUntilComplete() {
			retainFailureUntilComplete = true;
		},
		ownerSettlement: ownerSettlement.promise,
		complete() {
			complete();
		},
		completeWithAfterClearBarrier: complete,
		fail(code, cause) {
			producerError ??= cause;
			abortFrozenOperations.add(operation);
			detachUpstreamAbort();
			finalizationLease.clear();
			if (!result) setResult({
				kind: "failed",
				code,
				cause
			});
			if (!retainFailureUntilComplete && !retainStateUntilCompleteOperations.has(operation)) clearState();
			else scheduleTerminalSettle();
		},
		abortByUser: () => abortIfAllowed("user_abort"),
		abortForRestart: () => abortIfAllowed("restart"),
		supersede(beforeSupersede) {
			const abortFrozen = abortFrozenOperations.has(operation);
			if (result || stateCleared || !abortFrozen && !isReplyOperationAbortable(operation)) return false;
			beforeSupersede?.();
			if (abortFrozen) {
				setResult({
					kind: "aborted",
					code: "aborted_for_supersession"
				});
				scheduleTerminalSettle();
				return true;
			}
			abortOperation("superseded", createAgentRunSupersededAbortError());
			return true;
		}
	};
	clearReplyOperationByOperation.set(operation, clearState);
	producerCompletionByOperation.set(operation, producerCompletion.promise);
	backendReadyByOperation.set(operation, backendReady.promise);
	expireReplyOperationByOperation.set(operation, (reason, options) => {
		if (replyRunState.activeRunsByKey.get(currentSessionKey) !== operation || reason !== "finalization_stalled" && hasCommittedReplyOperationOutcome(operation)) return false;
		if (!result) {
			abortFrozenOperations.add(operation);
			detachUpstreamAbort();
			staleExpiryReason = reason;
			setResult({
				kind: "failed",
				code: "run_stalled"
			});
		}
		if (options?.afterClearBarrier) pendingClearBarrier = registerFollowupAdmissionBarrier(operation, options.afterClearBarrier, options.followupAdmissionBarrierTimeout);
		const backend = getAttachedBackend(operation);
		let cancelFailed = false;
		try {
			backend?.cancel("superseded");
		} catch (error) {
			cancelFailed = true;
			diagnosticLogger.warn(`reply run stale takeover cancel failed: sessionKey=${currentSessionKey} reason=${reason} owner=${stateCleared ? "completed" : "retained"} error=${String(error)}`);
		}
		controller.abort(createAbortError("Reply operation expired as stale"));
		if (stateCleared) {
			warnForcedRelease("stale takeover", reason);
			return true;
		}
		if (!cancelFailed) diagnosticLogger.warn(`reply run stale takeover retained: sessionKey=${currentSessionKey} reason=${reason} owner=awaiting_terminal_completion backend=${backend ? "attached" : "pending"}`);
		scheduleTerminalSettle();
		return false;
	});
	const finalizationLease = createReplyRunFinalizationLease({
		owner: operation,
		canExpire: () => !stateCleared && !result && replyRunState.activeRunsByKey.get(currentSessionKey) === operation,
		onActivity: recordActivity,
		onFinalizationProgress: () => markProgress("reply_operation:finalizing_progress"),
		onExpire: () => {
			warnForcedRelease("finalization settle");
			if (expireReplyOperationByOperation.get(operation)?.("finalization_stalled") === false && replyRunState.activeRunsByKey.get(currentSessionKey) === operation) forceClearReplyOperation(operation);
		}
	});
	const terminalSettleTimer = createReplyRunSettleTimer({
		canExpire: () => replyRunState.activeRunsByKey.get(currentSessionKey) === operation,
		onExpire: () => {
			warnForcedRelease("terminal settle");
			clearState();
		}
	});
	evictReplyOperationByOperation.set(operation, () => {
		if (stateCleared) return;
		if (!result) setResult({
			kind: "aborted",
			code: "aborted_for_restart"
		});
		controller.abort(createAgentRunRestartAbortError());
		try {
			getAttachedBackend(operation)?.cancel("restart");
		} catch (error) {
			diagnosticLogger.warn(`reply run lifecycle eviction cancel failed: sessionKey=${currentSessionKey} error=${String(error)}`);
			throw error;
		} finally {
			clearState();
		}
	});
	replyRunState.activeRunsByKey.set(sessionKey, operation);
	replyRunState.activeKeysBySessionId.set(currentSessionId, sessionKey);
	replyRunState.waitKeysBySessionId.set(currentSessionId, sessionKey);
	notifyGatewayWorkMetricsChanged();
	markProgress("reply_operation:queued");
	if (upstreamAbortSignal) {
		operationsByUpstreamAbortSignal.set(upstreamAbortSignal, operation);
		const abortFromUpstream = () => {
			if (result) return;
			const restart = isAgentRunRestartAbortReason(upstreamAbortSignal.reason);
			const superseded = isAgentRunSupersededAbortReason(upstreamAbortSignal.reason);
			abortOperation(restart ? "restart" : superseded ? "superseded" : "user_abort", upstreamAbortSignal.reason);
		};
		if (upstreamAbortSignal.aborted) abortFromUpstream();
		else {
			upstreamAbortHandler = abortFromUpstream;
			upstreamAbortSignal.addEventListener("abort", upstreamAbortHandler, { once: true });
		}
	}
	return operation;
}
//#endregion
//#region src/auto-reply/reply/reply-run-registry.registry.ts
function isReplyOperationForSession(params, operation) {
	return operation !== void 0 && (!params.sessionId || operation.sessionId === params.sessionId) && params.sessionKeys.some((key) => agentSessionKeysMatchByRequestKey(operation.key, key)) && chatRunBelongsToAgent({
		agentId: operation.agentId,
		sessionKey: operation.key,
		defaultAgentId: params.defaultAgentId
	}, params.agentId);
}
function resolveReplyOperationsForSession(params) {
	const candidates = [...params.sessionKeys.map((key) => replyRunRegistry.get(key)), ...params.sessionId ? [resolveReplyRunForCurrentSessionId(params.sessionId)] : []];
	return [...new Set(candidates)].filter((operation) => isReplyOperationForSession(params, operation));
}
async function waitForReplyOperationOwnerSettlement(operation, timeoutMs) {
	const settlement = operation.ownerSettlement;
	if (!settlement) return true;
	return timeoutMs === null ? settlement.then(() => true) : settlesWithin(settlement, resolveTimerTimeoutMs(timeoutMs, 100, 100));
}
function expireStaleReplyRunBySessionId(sessionId, reason, options) {
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	return operation ? expireStaleReplyOperation(operation, reason, options) : false;
}
function markReplyOperationGlobalLaneWaitProgress(operation) {
	if (operation.result || operation.phase !== "waiting_for_global_lane") return;
	markDiagnosticRunProgress({
		sessionKey: operation.key,
		sessionId: operation.sessionId,
		reason: "global_lane:waiting"
	});
}
function isReplyRunEvidenceStaleBySessionId(sessionId) {
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	return operation ? isReplyRunEvidenceStale(operation) : false;
}
function allowsDirectMessageInjectionOwner(sessionKey) {
	const operation = replyRunState.activeRunsByKey.get(sessionKey);
	return !operation || !operation.result && !operation.abortSignal.aborted && isReplyOperationPreBackendPhase(operation.phase) && !hasReplyOperationExecutionStarted(operation) && !getAttachedBackend(operation);
}
function getReplyRun(sessionKey) {
	const normalizedSessionKey = normalizeOptionalString(sessionKey);
	return normalizedSessionKey ? replyRunState.activeRunsByKey.get(normalizedSessionKey) : void 0;
}
const replyRunRegistry = {
	begin: createReplyOperation,
	get: getReplyRun,
	isActive: (sessionKey) => getReplyRun(sessionKey) !== void 0,
	bindSourceTurnId(operation, sourceTurnId) {
		if (replyRunState.activeRunsByKey.get(operation.key) !== operation || operation.result || operation.abortSignal.aborted) return;
		replyRunState.sourceTurnByKey.set(operation.key, sourceTurnId);
	},
	getSourceTurnId(sessionKey) {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		return normalizedSessionKey ? replyRunState.sourceTurnByKey.get(normalizedSessionKey) : void 0;
	},
	resolveCurrentMessageInjectionTarget(sessionKey) {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		const operation = this.get(sessionKey);
		const resolved = resolveReplyMessageInjectionRejection({ operation });
		const backend = "injection" in resolved ? resolved.backend : void 0;
		if (!normalizedSessionKey) return;
		if (!operation || !backend) return captureDirectEmbeddedMessageInjectionTarget(normalizedSessionKey, () => allowsDirectMessageInjectionOwner(normalizedSessionKey));
		const sourceTurnId = replyRunState.sourceTurnByKey.get(normalizedSessionKey);
		return {
			[replyMessageInjectionTargetOwner]: {
				backendIdentity: backend,
				acceptParticipant: (overlay) => operation.personalToolParticipants?.accept(overlay),
				projectToolAuthorityFingerprint: (overlay) => operation.projectToolAuthorityFingerprint(overlay),
				projectToolAuthorityFingerprintAsync: (overlay) => operation.projectToolAuthorityFingerprintAsync(overlay),
				resolve: (params) => getAttachedBackend(operation) === backend ? resolveReplyMessageInjectionRejection({
					...params,
					operation
				}) : { reason: "no_active_run" },
				recordAccepted: (options) => {
					operation.recordActivity();
					operation.markSteeredInputAccepted({ inboundAudio: options?.inboundAudio === true });
				},
				abort: () => operation.abortByUser()
			},
			...backend.runId ? { runId: backend.runId } : {},
			...sourceTurnId ? { sourceTurnId } : {}
		};
	},
	resolveCurrentInterruptTarget(sessionKey) {
		const operation = this.get(sessionKey);
		return operation ? { [replyRunInterruptTargetOperation]: operation } : void 0;
	},
	abort(sessionKey) {
		return this.get(sessionKey)?.abortByUser() ?? false;
	},
	waitForIdle(sessionKey, timeoutMs, opts) {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		if (!normalizedSessionKey || !replyRunState.activeRunsByKey.has(normalizedSessionKey)) return Promise.resolve(true);
		if (opts?.signal?.aborted) return Promise.resolve(false);
		return new Promise((resolve) => {
			const waiters = replyRunState.waitersByKey.get(normalizedSessionKey) ?? /* @__PURE__ */ new Set();
			const abortHandler = () => waiter(false);
			let timer;
			const waiter = (ended) => {
				if (!waiters.delete(waiter)) return;
				if (waiters.size === 0) replyRunState.waitersByKey.delete(normalizedSessionKey);
				clearTimeout(timer);
				opts?.signal?.removeEventListener("abort", abortHandler);
				resolve(ended);
			};
			if (typeof timeoutMs === "number" && Number.isFinite(timeoutMs)) timer = setTimeout(() => waiter(false), resolveTimerTimeoutMs(timeoutMs, 100, 100));
			opts?.signal?.addEventListener("abort", abortHandler, { once: true });
			waiters.add(waiter);
			replyRunState.waitersByKey.set(normalizedSessionKey, waiters);
			if (!replyRunState.activeRunsByKey.has(normalizedSessionKey)) waiter(true);
		});
	},
	resolveSessionId: (sessionKey) => getReplyRun(sessionKey)?.sessionId
};
/** Abort and await only the captured operation; a same-key successor is never rediscovered. */
async function interruptReplyRunTarget(target, timeoutMs = REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS) {
	const operation = target[replyRunInterruptTargetOperation];
	return {
		aborted: operation.abortByUser(),
		settled: await waitForReplyOperationOwnerSettlement(operation, timeoutMs)
	};
}
function resolveActiveReplyRunSessionId(sessionKey, options) {
	const operation = getReplyRun(sessionKey);
	return operation && (!options?.executionStartedOnly || hasReplyOperationExecutionStarted(operation)) ? operation.sessionId : void 0;
}
/** Cancels the current reply backend only when its native run identity matches exactly. */
function supersedeReplyRunByRunId(runId, beforeCancel) {
	const expectedRunId = normalizeOptionalString(runId);
	if (!expectedRunId) return false;
	for (const operation of replyRunState.activeRunsByKey.values()) {
		const backend = getAttachedBackend(operation);
		if (normalizeOptionalString(backend?.runId) !== expectedRunId) continue;
		return operation.supersede(beforeCancel);
	}
	return false;
}
function resolveActiveReplyRunThreadId(sessionKey) {
	return replyRunRegistry.get(sessionKey)?.routeThreadId;
}
function isReplyRunActiveForSessionId(sessionId) {
	return resolveReplyRunForCurrentSessionId(sessionId) !== void 0;
}
function isReplyRunAbortableForCompaction(sessionId) {
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	return Boolean(operation && !isReplyOperationPreBackendPhase(operation.phase));
}
function abortReplyRunBySessionId(sessionId) {
	return resolveReplyRunForCurrentSessionId(sessionId)?.abortByUser() ?? false;
}
function forceClearReplyRunBySessionId(sessionId, cause) {
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	return operation ? forceClearReplyOperation(operation, cause) : false;
}
function clearReplyRunForResetBySessionId(sessionId) {
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	if (!operation || isReplyOperationPreBackendPhase(operation.phase)) return;
	try {
		operation.abortForRestart();
	} finally {
		if (replyRunState.activeRunsByKey.get(operation.key) === operation) operation.complete();
	}
}
function waitForReplyRunEndBySessionId(sessionId, timeoutMs) {
	const waitKey = resolveReplyRunWaitKey(sessionId);
	return waitKey ? replyRunRegistry.waitForIdle(waitKey, timeoutMs) : Promise.resolve(true);
}
async function waitForReplyRunAdmissionBarrier(params) {
	const deadline = typeof params.timeoutMs === "number" ? Date.now() + resolveTimerTimeoutMs(params.timeoutMs, params.minimumTimeoutMs, params.minimumTimeoutMs) : void 0;
	const sources = /* @__PURE__ */ new Map();
	while (true) {
		if (params.signal?.aborted) return { settled: false };
		const barrier = params.barriersByKey.get(params.sessionKey);
		if (!barrier) return {
			settled: true,
			...sources.size ? { sources: [...sources.values()] } : {}
		};
		const remainingMs = deadline === void 0 ? void 0 : deadline - Date.now();
		if (remainingMs !== void 0 && remainingMs <= 0) return { settled: false };
		const interrupted = createDeferredCore();
		const timer = remainingMs === void 0 ? void 0 : setTimeout(() => interrupted.resolve(false), Math.max(1, remainingMs));
		timer?.unref?.();
		const abortHandler = () => interrupted.resolve(false);
		params.signal?.addEventListener("abort", abortHandler, { once: true });
		if (params.signal?.aborted) abortHandler();
		const outcome = await Promise.race([barrier.settled.then(() => true), interrupted.promise]);
		clearTimeout(timer);
		params.signal?.removeEventListener("abort", abortHandler);
		if (!outcome) return { settled: false };
		for (const [identity, source] of barrier.sources) sources.set(identity, mergeReplyRunAdmissionSource({
			...source,
			sessionIds: new Set(source.sessionIds)
		}, sources.get(identity)));
	}
}
async function waitForReplyRunFollowupAdmission(sessionKey, timeoutMs, opts) {
	const normalizedSessionKey = normalizeOptionalString(sessionKey);
	return normalizedSessionKey ? await waitForReplyRunAdmissionBarrier({
		barriersByKey: replyRunState.followupAdmissionBarriersByKey,
		minimumTimeoutMs: 100,
		sessionKey: normalizedSessionKey,
		signal: opts?.signal,
		timeoutMs
	}) : { settled: true };
}
async function waitForReplyRunSuccessorAdmission(sessionKey, timeoutMs, opts) {
	const normalizedSessionKey = normalizeOptionalString(sessionKey);
	return normalizedSessionKey ? await waitForReplyRunAdmissionBarrier({
		barriersByKey: replyRunState.successorAdmissionBarriersByKey,
		minimumTimeoutMs: 0,
		sessionKey: normalizedSessionKey,
		signal: opts?.signal,
		timeoutMs
	}) : { settled: true };
}
function abortReplyRuns(operations, opts, isCurrent) {
	let aborted = 0;
	for (const operation of operations) {
		if (isCurrent && !isCurrent(operation)) continue;
		try {
			if (opts.mode === "compacting" && !isReplyRunCompacting(operation)) continue;
			if (operation.abortForRestart()) aborted += 1;
		} catch (error) {
			if (operation.result?.kind === "aborted" && operation.result.code === "aborted_for_restart") aborted += 1;
			opts.onAbortError?.(operation.sessionId, error);
		}
	}
	return aborted;
}
function abortActiveReplyRuns(opts) {
	return abortReplyRuns(replyRunState.activeRunsByKey.values(), opts) > 0;
}
/** Snapshot before durable marking; never cancel another instance or a replacement after the await. */
function captureGatewayReplyRunRestartAbort(resolveGatewayContext) {
	const operations = Array.from(replyRunState.activeRunsByKey.values()).filter((operation) => hasGatewayContextOwner(operation, resolveGatewayContext));
	return (onAbortError) => abortReplyRuns(operations, {
		mode: "all",
		onAbortError
	}, (operation) => replyRunState.activeRunsByKey.get(operation.key) === operation && operation.lifecycleGeneration !== void 0 && isAgentEventLifecycleGenerationCurrent(operation.lifecycleGeneration) && hasGatewayContextOwner(operation, resolveGatewayContext));
}
function getActiveReplyRunCount() {
	return replyRunState.activeRunsByKey.size;
}
function listActiveReplyRunSessionIds() {
	return Array.from(replyRunState.activeRunsByKey.values(), (operation) => operation.sessionId);
}
function listActiveReplyRunSessionKeys() {
	return [...replyRunState.activeRunsByKey.keys()];
}
function evictPriorLifecycleReplyRuns() {
	const errors = [];
	const attempt = (evict) => {
		try {
			evict();
			return true;
		} catch (error) {
			errors.push(error);
			return false;
		}
	};
	for (const operation of replyRunState.activeRunsByKey.values()) {
		if (operation.lifecycleGeneration && isAgentEventLifecycleGenerationCurrent(operation.lifecycleGeneration)) continue;
		const evict = evictReplyOperationByOperation.get(operation);
		if (evict && attempt(evict)) continue;
		attempt(() => clearReplyRunState(operation));
	}
	if (errors.length > 0) throw new AggregateError(errors, "Failed to abort stale reply runs");
}
registerAgentEventLifecycleRotationHandler("reply-runs", evictPriorLifecycleReplyRuns);
const replyRunRegistryTestApi = { resetReplyRunRegistry() {
	for (const [sessionKey, operation] of replyRunState.activeRunsByKey) markDiagnosticRunProgress({
		sessionKey,
		sessionId: operation.sessionId,
		reason: "reply_operation:registry_reset"
	});
	replyRunState.activeRunsByKey.clear();
	replyRunState.activeKeysBySessionId.clear();
	replyRunState.waitKeysBySessionId.clear();
	replyRunState.sourceTurnByKey.clear();
	resetReplyRunSettleTimersForTesting();
	for (const waiters of replyRunState.waitersByKey.values()) for (const waiter of waiters) waiter(false);
	replyRunState.waitersByKey.clear();
	replyRunState.followupAdmissionBarriersByKey.clear();
	replyRunState.successorAdmissionBarriersByKey.clear();
} };
if (process.env.VITEST === "true" || false) globalThis[Symbol.for("openclaw.replyRunRegistryTestApi")] = replyRunRegistryTestApi;
//#endregion
export { resolveEmbeddedInjection as A, waitForReplyRunFollowupAdmission as C, beginReplyOperationFinalizationWork as D, createReplyTurnParticipants as E, finalizeReplyMessageInjectionAttempt as M, resolveReplyBackendQueueMessageMismatch as N, createEmbeddedMessageInjectionQueue as O, waitForReplyRunEndBySessionId as S, createReplyOperation as T, resolveActiveReplyRunSessionId as _, expireStaleReplyRunBySessionId as a, supersedeReplyRunByRunId as b, interruptReplyRunTarget as c, isReplyRunActiveForSessionId as d, isReplyRunEvidenceStaleBySessionId as f, replyRunRegistry as g, markReplyOperationGlobalLaneWaitProgress as h, clearReplyRunForResetBySessionId as i, beginReplyMessageInjectionTarget as j, prepareEmbeddedInjectionAuthority as k, isReplyOperationForSession as l, listActiveReplyRunSessionKeys as m, abortReplyRunBySessionId as n, forceClearReplyRunBySessionId as o, listActiveReplyRunSessionIds as p, captureGatewayReplyRunRestartAbort as r, getActiveReplyRunCount as s, abortActiveReplyRuns as t, isReplyRunAbortableForCompaction as u, resolveActiveReplyRunThreadId as v, waitForReplyRunSuccessorAdmission as w, waitForReplyOperationOwnerSettlement as x, resolveReplyOperationsForSession as y };
