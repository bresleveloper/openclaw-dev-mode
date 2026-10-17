import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { n as collectErrorGraphCandidates, u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as createAbortError } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { t as SessionPendingInputCustodyError } from "./session-pending-input-custody-error-fcZzzQWk.mjs";
import { r as agentSessionKeysMatchByRequestKey } from "./session-key-C09ow4h0.mjs";
import { s as hasGatewayContextOwner } from "./gateway-context-binding-VqB7gkMe.mjs";
import "./gateway-request-scope-BSmCVVpP.mjs";
import { A as validateAgentRunDelegatedAuthority, c as getActiveAgentRunDelegatedAuthority, l as getAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
import { h as registerAgentEventLifecycleRotationHandler, l as getAgentEventLifecycleGeneration, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-GvNTkbe3.mjs";
import { t as settlesWithin } from "./settle-within-CTpJLoBG.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
import { n as createMessageInjectionAuthority, t as MessageInjectionAuthorityError } from "./message-injection-authority-CJuS3j6I.mjs";
import { $ as replyRunInterruptTargetOperation, B as startReplyOperationSuccessorBarriers, C as mergeReplyRunAdmissionSource, D as prepareReplyRunKeyUpdate, E as operationsByUpstreamAbortSignal, F as resolveReplyRunWaitKey, G as isEmbeddedRunHandleAbortable, H as updateSuccessorAdmissionSessionId, J as REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS, N as resolveReplyOperationAgentId, O as producerCompletionByOperation, P as resolveReplyRunForCurrentSessionId, Q as replyMessageInjectionTargetOwner, R as retainStateUntilCompleteOperations, V as updateFollowupAdmissionSessionId, W as canSteerEmbeddedRunDuringCompaction, X as ReplyRunFollowupAdmissionBlockedError, Y as ReplyRunAlreadyActiveError, Z as ReplyRunSuccessorAdmissionBlockedError, a as evictReplyOperationByOperation, d as getAttachedBackend, f as hasCommittedReplyOperationOutcome, g as isReplyOperationPreBackendPhase, i as clearReplyRunState, j as replyRunState, k as registerFollowupAdmissionBarrier, l as flushReplyOperationAfterClear, m as isReplyOperationAbortable, n as attachedBackendByOperation, o as expireReplyOperationByOperation, p as hasReplyOperationExecutionStarted, q as REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS, r as clearReplyOperationByOperation, s as expireStaleReplyOperation, t as abortFrozenOperations, u as forceClearReplyOperation, v as isReplyRunCompacting, w as notifyReplyRunEnded, y as isReplyRunEvidenceStale } from "./reply-run-registry.state-DhKeZ1Xr.mjs";
import { a as logMessageQueuedWithBacklogPolicy, t as diagnosticLogger } from "./diagnostic-runtime-Clvsorku.mjs";
import { i as QuestionDispatchUnsupportedError, n as QuestionAnswerUnconfirmedError, r as QuestionDispatchRefusedError } from "./gateway-question-dispatch-CGXrRYIv.mjs";
import { t as hasPromptImageInput } from "./prompt-image-input-EpP8AiM6.mjs";
import { _ as resolveActiveEmbeddedRunRecoveryBlocker, a as ACTIVE_EMBEDDED_RUNS_BY_RUN_ID, c as ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY, i as ACTIVE_EMBEDDED_RUNS, o as ACTIVE_EMBEDDED_RUN_REGISTRATIONS } from "./run-state-BmDkKYBf.mjs";
import { b as resolveRunStaleThresholdMs, f as markDiagnosticRunProgress, o as getDiagnosticSessionActivitySnapshot } from "./diagnostic-run-activity-BlCpLag4.mjs";
import { d as isAgentRunSupersededAbortReason, o as createAgentRunRestartAbortError, s as createAgentRunSupersededAbortError, u as isAgentRunRestartAbortReason } from "./run-termination-DGv2EKii.mjs";
import { a as resetReplyRunSettleTimersForTesting, i as formatReplyOperationResult, n as createReplyRunFinalizationLease, r as createReplyRunSettleTimer } from "./reply-run-finalization-lease-BfXIWjH3.mjs";
import { t as hasInboundAudio } from "./inbound-media-ddGEX7sF.mjs";
import { t as chatRunBelongsToAgent } from "./chat-run-owner-Ci8Mz1ow.mjs";
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
function resolveReplyBackendMessageInjection(backend, canInject, sourceBound) {
	const guarded = backend.messageInjectionV2;
	if (guarded?.version === 2) {
		const assertCurrent = createMessageInjectionAuthority(canInject);
		const authorityKind = sourceBound ? "source-bound" : "run";
		return {
			isAvailable: () => guarded.isAvailable(),
			queueMessage: (text, options) => guarded.queueMessage(text, options, assertCurrent, authorityKind),
			claimPendingUserInputAnswer: guarded.claimPendingUserInputAnswer ? (text, options) => guarded.claimPendingUserInputAnswer(text, options, assertCurrent, authorityKind) : void 0,
			cancelPendingUserInput: guarded.cancelPendingUserInput ? (resolvedBy) => guarded.cancelPendingUserInput(resolvedBy, assertCurrent, authorityKind) : void 0
		};
	}
	if (sourceBound) {
		createMessageInjectionAuthority(canInject)();
		return;
	}
	if (backend.messageInjection) {
		const injection = backend.messageInjection;
		return {
			isAvailable: () => injection.isAvailable(),
			queueMessage: (text, options) => injection.queueMessage(text, options),
			claimPendingUserInputAnswer: backend.claimPendingUserInputAnswer?.bind(backend),
			cancelPendingUserInput: backend.cancelPendingUserInput?.bind(backend)
		};
	}
	if (!backend.queueMessage) return;
	return {
		claimPendingUserInputAnswer: backend.claimPendingUserInputAnswer?.bind(backend),
		cancelPendingUserInput: backend.cancelPendingUserInput?.bind(backend),
		isAvailable: () => {
			return !backend.isStopped?.();
		},
		queueMessage: (text, options) => options ? backend.queueMessage(text, options) : backend.queueMessage(text)
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
		params.assertCurrent?.();
		return params.canInject();
	};
	const injection = backend ? resolveReplyBackendMessageInjection(backend, canInject, params.assertCurrent !== void 0) : void 0;
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
		injection
	};
}
function resolveReplyMessageInjectionFailure(error, params) {
	const { assertCurrent, accepted } = params;
	const candidates = collectErrorGraphCandidates(error, (current) => [current.cause]);
	const unsupported = candidates.findLast((candidate) => candidate instanceof QuestionDispatchUnsupportedError);
	const unconfirmed = candidates.findLast((candidate) => candidate instanceof QuestionAnswerUnconfirmedError);
	if (unconfirmed) return {
		status: "indeterminate",
		errorMessage: unconfirmed.message
	};
	const refusal = candidates.findLast((candidate) => candidate instanceof MessageInjectionAuthorityError || (assertCurrent !== void 0 || unsupported !== void 0) && (candidate instanceof QuestionDispatchRefusedError && !(candidate instanceof QuestionDispatchUnsupportedError) || candidate instanceof SessionPendingInputCustodyError));
	if (unsupported && !refusal && !accepted) {
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
	}
	const authorityError = refusal ?? unsupported;
	if (authorityError instanceof MessageInjectionAuthorityError || authorityError instanceof QuestionDispatchRefusedError || authorityError instanceof SessionPendingInputCustodyError) return {
		status: "failed",
		error: authorityError instanceof MessageInjectionAuthorityError && authorityError.cause instanceof Error ? authorityError.cause : authorityError
	};
}
function beginReplyMessageInjectionTarget(target, text, options) {
	const owner = target[replyMessageInjectionTargetOwner];
	const { toolAuthorityOverlay, personalToolParticipant, assertCurrent, allowPendingUserInputAnswer, inboundAudio, ...backendOptions } = options ?? {};
	const projectedToolAuthorityFingerprint = toolAuthorityOverlay ? owner.projectToolAuthorityFingerprint(toolAuthorityOverlay) : backendOptions.toolAuthorityFingerprint;
	const queueOptions = options ? {
		...backendOptions,
		...toolAuthorityOverlay ? { toolAuthorityFingerprint: projectedToolAuthorityFingerprint } : {}
	} : void 0;
	const resolved = owner.resolve({
		options: queueOptions,
		personalToolParticipant: toolAuthorityOverlay ?? personalToolParticipant,
		inboundAudio,
		allowPendingUserInputAnswer,
		assertCurrent
	});
	if (!("injection" in resolved)) {
		const immediateRejection = {
			status: "rejected",
			reason: resolved.reason,
			...resolved.errorMessage ? { errorMessage: resolved.errorMessage } : {}
		};
		const cancelPendingImage = options?.isInboundUserMessage === true && hasPromptImageInput(options) && (resolved.reason === "tool_authority_mismatch" || resolved.reason === "input_visibility_mismatch" || resolved.reason === "image_input_unsupported") ? resolved.cancelPendingUserInput : void 0;
		let outcome = Promise.resolve(immediateRejection);
		if (cancelPendingImage) {
			const onCancellationError = (error) => {
				const failure = resolveReplyMessageInjectionFailure(error, {
					assertCurrent,
					accepted: false
				});
				if (!failure) throw error;
				return failure;
			};
			try {
				outcome = Promise.resolve(cancelPendingImage("image-reply")).then(() => immediateRejection, onCancellationError);
			} catch (error) {
				outcome = Promise.resolve(onCancellationError(error));
			}
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
				recordParticipant();
				settleAcceptance(true);
			}
		}
	};
	const failed = (error) => {
		const outcome = resolveReplyMessageInjectionFailure(error, {
			assertCurrent,
			accepted: acceptanceSettled
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
		queued = resolved.injection.queueMessage(text, runtimeQueueOptions);
	} catch (error) {
		return {
			targetRunId,
			acceptance: acceptance.promise,
			outcome: Promise.resolve(failed(error))
		};
	}
	const outcome = queued.then(async (result) => {
		recordParticipant();
		settleAcceptance(true);
		if (targetRunId && queueOptions?.waitForTranscriptCommit === true && result?.transcriptCommit !== "unconfirmed") await userTurnTranscriptRecorder?.confirmSteerTargetRunIdForPersistence?.(targetRunId);
		return result ? {
			status: "accepted",
			result
		} : { status: "accepted" };
	}, failed);
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
	if (outcome.status === "indeterminate") {
		let adoptionError;
		try {
			await params.onAdopted?.();
		} catch (error) {
			adoptionError = error;
		}
		return {
			status: "indeterminate",
			outcome,
			targetRunId: params.attempt.targetRunId,
			adoptionError
		};
	}
	const owner = params.target[replyMessageInjectionTargetOwner];
	owner.recordAccepted({ inboundAudio: params.inboundAudio });
	let aborted = outcome.result?.transcriptCommit === "unconfirmed" && params.abortOnUnconfirmedTranscript !== false;
	if (aborted) owner.abort();
	let adoptionError;
	try {
		await params.onAdopted?.();
	} catch (error) {
		adoptionError = error;
		if (params.shouldAbortOnAdoptionError?.(error)) {
			owner.abort();
			aborted = true;
		}
	}
	return {
		status: "accepted",
		outcome,
		targetRunId: params.attempt.targetRunId,
		aborted,
		...adoptionError === void 0 ? {} : { adoptionError }
	};
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
/** Owns frozen policy, concrete attempt routing, and backend authority for one operation. */
function createReplyOperationToolAuthority(lifecycle) {
	let fingerprint;
	let snapshot;
	let route;
	let automaticFallbackRoute;
	let participants;
	return {
		get personalToolParticipants() {
			return participants;
		},
		close() {
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
			if (!lifecycle.isOpen() || snapshot && snapshot !== value) throw new Error("Reply operation cannot change tool authority after admission");
			if (snapshot) return;
			const initialFingerprint = normalizeOptionalString(value.fingerprint());
			if (!initialFingerprint) throw new Error("Reply operation tool authority fingerprint is required");
			snapshot = value;
			fingerprint = initialFingerprint;
			participants = createReplyTurnParticipants(value.personalToolOwner);
		},
		projectToolAuthorityFingerprint(overlay) {
			if (!lifecycle.isOpen() || !snapshot || !route) return;
			try {
				return normalizeOptionalString(snapshot.project(overlay, route));
			} catch {
				return;
			}
		},
		bindToolAuthorityRoute(value) {
			if (!lifecycle.isOpen() || !snapshot || !lifecycle.ownsRunSlot()) throw new Error("Reply operation has no active tool authority snapshot");
			const provider = normalizeOptionalString(value.provider);
			const model = normalizeOptionalString(value.model);
			if (!provider || !model) throw new Error("Reply operation tool authority route is required");
			const preparedRoute = {
				provider,
				model
			};
			const preparedFingerprint = snapshot.fingerprint(preparedRoute);
			route = preparedRoute;
			fingerprint = preparedFingerprint;
			return fingerprint;
		}
	};
}
//#endregion
//#region src/auto-reply/reply/reply-run-registry.operation.ts
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
		ownsRunSlot: () => replyRunState.activeRunsByKey.get(currentSessionKey) === operation
	});
	const ownerSettlement = createDeferredCore();
	const producerCompletion = createDeferredCore();
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
	};
	const markProgress = (reason) => {
		markDiagnosticRunProgress({
			sessionId: currentSessionId,
			sessionKey: currentSessionKey,
			reason
		});
	};
	const clearState = (afterClearBarrier, followupAdmissionBarrierTimeout) => {
		if (stateCleared) return;
		stateCleared = true;
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
		clearReplyRunState({
			sessionKey: currentSessionKey,
			sessionId: currentSessionId,
			operation
		});
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
	const abortOperation = (reason, abortReason, abortedCode) => {
		const phaseBeforeAbort = phase;
		if (!result) {
			setResult({
				kind: "aborted",
				code: abortedCode
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
		},
		markWaitingForDeferredMaintenance() {
			if (result || phase !== "queued") return;
			phase = "waiting_for_deferred_maintenance";
			markProgress("deferred_maintenance:waiting");
		},
		markDeferredMaintenanceWaitEnded() {
			if (result || phase !== "waiting_for_deferred_maintenance") return;
			phase = "queued";
			markProgress("deferred_maintenance:wait_ended");
		},
		markWaitingForGlobalLane() {
			if (result || phase !== "queued" && phase !== "running") return;
			phaseBeforeGlobalLaneWait = phase;
			phase = "waiting_for_global_lane";
			markProgress("global_lane:waiting");
		},
		markGlobalLaneWaitEnded() {
			if (result || phase !== "waiting_for_global_lane") return;
			phase = phaseBeforeGlobalLaneWait ?? "queued";
			phaseBeforeGlobalLaneWait = void 0;
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
		projectToolAuthorityFingerprint: toolAuthority.projectToolAuthorityFingerprint,
		bindToolAuthorityRoute: toolAuthority.bindToolAuthorityRoute,
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
			replyRunState.activeSessionIdsByKey.set(currentSessionKey, currentSessionId);
			replyRunState.activeKeysBySessionId.set(currentSessionId, currentSessionKey);
			replyRunState.waitKeysBySessionId.set(currentSessionId, currentSessionKey);
			markProgress("reply_operation:session_updated");
		},
		updateSessionKey(nextSessionKey, agentId) {
			const update = prepareReplyRunKeyUpdate(operation, nextSessionKey, agentId, stateCleared);
			if (!update) return;
			recordActivity();
			currentAgentId = update.agentId;
			if (update.sessionKey === currentSessionKey) return;
			const previousKey = currentSessionKey;
			replyRunState.activeRunsByKey.delete(previousKey);
			replyRunState.activeSessionIdsByKey.delete(previousKey);
			currentSessionKey = update.sessionKey;
			replyRunState.activeRunsByKey.set(currentSessionKey, operation);
			replyRunState.activeSessionIdsByKey.set(currentSessionKey, currentSessionId);
			replyRunState.activeKeysBySessionId.set(currentSessionId, currentSessionKey);
			for (const ownedSessionId of ownedSessionIds) if (replyRunState.waitKeysBySessionId.get(ownedSessionId) === previousKey) replyRunState.waitKeysBySessionId.set(ownedSessionId, currentSessionKey);
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
			producerCompletion.resolve();
			if (!result) setResult({ kind: "completed" });
			clearState();
			settleOwner();
		},
		completeWithAfterClearBarrier(barrier, timeoutMs) {
			producerCompletion.resolve();
			const completed = Promise.resolve(barrier).then(() => {}, () => {});
			ownerCompletionBarrier = ownerCompletionBarrier ? Promise.all([ownerCompletionBarrier, completed]).then(() => {}) : completed;
			if (!result) setResult({ kind: "completed" });
			clearState(barrier, timeoutMs);
			settleOwner();
		},
		fail(code, cause) {
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
		abortByUser() {
			if (!isReplyOperationAbortable(operation)) return false;
			abortOperation("user_abort", createAbortError("Reply operation aborted by user"), "aborted_by_user");
			return true;
		},
		abortForRestart() {
			if (!isReplyOperationAbortable(operation)) return false;
			abortOperation("restart", createAgentRunRestartAbortError(), "aborted_for_restart");
			return true;
		},
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
			abortOperation("superseded", createAgentRunSupersededAbortError(), "aborted_for_supersession");
			return true;
		}
	};
	clearReplyOperationByOperation.set(operation, clearState);
	producerCompletionByOperation.set(operation, producerCompletion.promise);
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
			diagnosticLogger.warn(`reply run stale takeover: forced release sessionKey=${currentSessionKey} reason=${reason} phase=${phase} result=${formatReplyOperationResult(result)} ageMs=${Date.now() - lastActivityAtMs} ranForMs=${Date.now() - startedAtMs}`);
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
			diagnosticLogger.warn(`reply run finalization settle: forced release sessionKey=${currentSessionKey} phase=${phase} result=${formatReplyOperationResult(result)} ageMs=${Date.now() - lastActivityAtMs} ranForMs=${Date.now() - startedAtMs}`);
			if (expireReplyOperationByOperation.get(operation)?.("finalization_stalled") === false && replyRunState.activeRunsByKey.get(currentSessionKey) === operation) forceClearReplyOperation(operation);
		}
	});
	const terminalSettleTimer = createReplyRunSettleTimer({
		canExpire: () => replyRunState.activeRunsByKey.get(currentSessionKey) === operation,
		onExpire: () => {
			diagnosticLogger.warn(`reply run terminal settle: forced release sessionKey=${currentSessionKey} phase=${phase} result=${formatReplyOperationResult(result)} ageMs=${Date.now() - lastActivityAtMs} ranForMs=${Date.now() - startedAtMs}`);
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
	replyRunState.activeSessionIdsByKey.set(sessionKey, currentSessionId);
	replyRunState.activeKeysBySessionId.set(currentSessionId, sessionKey);
	replyRunState.waitKeysBySessionId.set(currentSessionId, sessionKey);
	markProgress("reply_operation:queued");
	if (upstreamAbortSignal) {
		operationsByUpstreamAbortSignal.set(upstreamAbortSignal, operation);
		const abortFromUpstream = () => {
			if (result) return;
			const restart = isAgentRunRestartAbortReason(upstreamAbortSignal.reason);
			const superseded = isAgentRunSupersededAbortReason(upstreamAbortSignal.reason);
			abortOperation(restart ? "restart" : superseded ? "superseded" : "user_abort", upstreamAbortSignal.reason, restart ? "aborted_for_restart" : superseded ? "aborted_for_supersession" : "aborted_by_user");
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
	return settlesWithin(settlement, resolveTimerTimeoutMs(timeoutMs, 100, 100));
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
const replyRunRegistry = {
	begin: createReplyOperation,
	get(sessionKey) {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		if (!normalizedSessionKey) return;
		return replyRunState.activeRunsByKey.get(normalizedSessionKey);
	},
	isActive(sessionKey) {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		if (!normalizedSessionKey) return false;
		return replyRunState.activeRunsByKey.has(normalizedSessionKey);
	},
	bindSourceTurnId(operation, sourceTurnId) {
		if (replyRunState.activeRunsByKey.get(operation.key) !== operation || operation.result || operation.abortSignal.aborted) return;
		replyRunState.sourceTurnByKey.set(operation.key, sourceTurnId);
	},
	getSourceTurnId(sessionKey) {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		if (!normalizedSessionKey) return;
		return replyRunState.sourceTurnByKey.get(normalizedSessionKey);
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
				acceptParticipant: (overlay) => operation.personalToolParticipants?.accept(overlay),
				projectToolAuthorityFingerprint: (overlay) => operation.projectToolAuthorityFingerprint(overlay),
				resolve: (params) => resolveReplyMessageInjectionRejection({
					...params,
					operation
				}),
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
			let abortHandler;
			let settled = false;
			const waiter = { finish: (ended) => {
				if (settled) return;
				settled = true;
				waiters.delete(waiter);
				if (waiters.size === 0) replyRunState.waitersByKey.delete(normalizedSessionKey);
				if (waiter.timer) clearTimeout(waiter.timer);
				if (abortHandler) opts?.signal?.removeEventListener("abort", abortHandler);
				resolve(ended);
			} };
			if (typeof timeoutMs === "number" && Number.isFinite(timeoutMs)) waiter.timer = setTimeout(() => waiter.finish(false), resolveTimerTimeoutMs(timeoutMs, 100, 100));
			if (opts?.signal) {
				abortHandler = () => waiter.finish(false);
				opts.signal.addEventListener("abort", abortHandler, { once: true });
			}
			waiters.add(waiter);
			replyRunState.waitersByKey.set(normalizedSessionKey, waiters);
			if (!replyRunState.activeRunsByKey.has(normalizedSessionKey)) waiter.finish(true);
		});
	},
	resolveSessionId(sessionKey) {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		if (!normalizedSessionKey) return;
		return replyRunState.activeSessionIdsByKey.get(normalizedSessionKey);
	}
};
/** Abort and await only the captured operation; a same-key successor is never rediscovered. */
async function interruptReplyRunTarget(target, timeoutMs = REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS) {
	const operation = target[replyRunInterruptTargetOperation];
	return {
		aborted: operation.abortByUser(),
		settled: await waitForReplyOperationOwnerSettlement(operation, timeoutMs)
	};
}
function resolveActiveReplyRunSessionId(sessionKey) {
	return replyRunRegistry.resolveSessionId(sessionKey);
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
		let timer;
		let abortHandler;
		const outcome = await Promise.race([barrier.settled.then(() => true), new Promise((resolve) => {
			if (remainingMs !== void 0) {
				timer = setTimeout(() => resolve(false), Math.max(1, remainingMs));
				timer.unref?.();
			}
			if (params.signal) {
				abortHandler = () => resolve(false);
				params.signal.addEventListener("abort", abortHandler, { once: true });
				if (params.signal.aborted) abortHandler();
			}
		})]);
		if (timer) clearTimeout(timer);
		if (abortHandler) params.signal?.removeEventListener("abort", abortHandler);
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
	return [...replyRunState.activeSessionIdsByKey.values()];
}
function listActiveReplyRunSessionKeys() {
	return [...replyRunState.activeSessionIdsByKey.keys()];
}
function evictPriorLifecycleReplyRuns() {
	const errors = [];
	for (const operation of replyRunState.activeRunsByKey.values()) {
		if (operation.lifecycleGeneration && isAgentEventLifecycleGenerationCurrent(operation.lifecycleGeneration)) continue;
		const evict = evictReplyOperationByOperation.get(operation);
		if (evict) try {
			evict();
			continue;
		} catch (error) {
			errors.push(error);
		}
		else {
			try {
				if (!operation.abortForRestart()) errors.push(/* @__PURE__ */ new Error(`Stale reply operation was not abortable: ${operation.key}`));
			} catch (error) {
				errors.push(error);
			}
			try {
				operation.complete();
			} catch (error) {
				errors.push(error);
			}
		}
		try {
			clearReplyRunState({
				sessionKey: operation.key,
				sessionId: operation.sessionId,
				operation
			});
		} catch (error) {
			errors.push(error);
		}
	}
	if (errors.length > 0) throw new AggregateError(errors, "Failed to abort stale reply runs");
}
registerAgentEventLifecycleRotationHandler("reply-runs", evictPriorLifecycleReplyRuns);
const replyRunRegistryTestApi = { resetReplyRunRegistry() {
	for (const [sessionKey, sessionId] of replyRunState.activeSessionIdsByKey) markDiagnosticRunProgress({
		sessionKey,
		sessionId,
		reason: "reply_operation:registry_reset"
	});
	replyRunState.activeRunsByKey.clear();
	replyRunState.activeSessionIdsByKey.clear();
	replyRunState.activeKeysBySessionId.clear();
	replyRunState.waitKeysBySessionId.clear();
	replyRunState.sourceTurnByKey.clear();
	replyRunState.completionObservationsByKey?.clear();
	resetReplyRunSettleTimersForTesting();
	for (const waiters of replyRunState.waitersByKey.values()) for (const waiter of waiters) waiter.finish(false);
	replyRunState.waitersByKey.clear();
	replyRunState.followupAdmissionBarriersByKey.clear();
	replyRunState.successorAdmissionBarriersByKey.clear();
} };
if (process.env.VITEST === "true" || false) globalThis[Symbol.for("openclaw.replyRunRegistryTestApi")] = replyRunRegistryTestApi;
//#endregion
export { waitForReplyRunFollowupAdmission as C, beginReplyMessageInjectionTarget as D, createReplyTurnParticipants as E, finalizeReplyMessageInjectionAttempt as O, waitForReplyRunEndBySessionId as S, createReplyOperation as T, resolveActiveReplyRunSessionId as _, expireStaleReplyRunBySessionId as a, supersedeReplyRunByRunId as b, interruptReplyRunTarget as c, isReplyRunActiveForSessionId as d, isReplyRunEvidenceStaleBySessionId as f, replyRunRegistry as g, markReplyOperationGlobalLaneWaitProgress as h, clearReplyRunForResetBySessionId as i, resolveReplyBackendQueueMessageMismatch as k, isReplyOperationForSession as l, listActiveReplyRunSessionKeys as m, abortReplyRunBySessionId as n, forceClearReplyRunBySessionId as o, listActiveReplyRunSessionIds as p, captureGatewayReplyRunRestartAbort as r, getActiveReplyRunCount as s, abortActiveReplyRuns as t, isReplyRunAbortableForCompaction as u, resolveActiveReplyRunThreadId as v, waitForReplyRunSuccessorAdmission as w, waitForReplyOperationOwnerSettlement as x, resolveReplyOperationsForSession as y };
