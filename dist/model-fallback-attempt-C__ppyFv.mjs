import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import "./model-ref-shared-BRJ3VRZV.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { n as findAgentRunTerminalOutcome } from "./agent-run-terminal-error-HtG1NUd1.mjs";
import { n as FailoverError, o as isFailoverError } from "./error-Bcp4ZyOv.mjs";
import { d as isAgentRunSupersededAbortReason, f as isSessionPlacementSettlementClosedError, l as isAgentRunDirectAbortReason, u as isAgentRunRestartAbortReason } from "./run-termination-Dwf1ksjA.mjs";
import { a as isAgentHarnessPreflightError, i as MissingAgentHarnessError } from "./errors-BAipjK5G.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BESW9cGp.mjs";
import { n as getRegisteredAgentHarness } from "./registry-BDZ8eM01.mjs";
import { t as isCliProvider } from "./model-selection-cli-CxV7VRIV.mjs";
import { r as isCliRuntimeAlias } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { r as externalCliDiscoveryForProviders } from "./external-cli-discovery-kYfv_bUN.mjs";
import { n as isLikelyContextOverflowError } from "./context-overflow-kbcu3uXy.mjs";
import "./classify-PIr_bdgF.mjs";
import { c as hasModelFallbackStop, h as resolveModelFallbackError, i as describeFailoverError, t as buildFailoverRemediationHint } from "./failover-error-Bjf0VdY2.mjs";
import { a as runWithDeferredSessionSuspension, o as suspendSession } from "./session-suspension-CAhJSkXK.mjs";
import { u as isCommandLaneTaskTimeoutError } from "./command-queue-Dvag6gVL.mjs";
import "./errors-CaC34RQp.mjs";
import { r as isCronTerminalAbortReasonText } from "./execution-errors-MLvRe_c_.mjs";
import { n as renewAgentRunDeadline } from "./agent-run-deadline-DOxupoZB.mjs";
import { i as isOpenClawAbortableWrapper } from "./abortable-CD217r1Y.mjs";
import { n as buildTextObservationFields } from "./embedded-agent-error-observation-D3FVUug5.mjs";
import { n as isSandboxProvisioningError } from "./provisioning-error-CG_fGcV-.mjs";
//#region src/agents/model-fallback-observation.ts
const decisionLog = createSubsystemLogger("model-fallback").child("decision");
const AUTH_DECISION_LOG_COALESCE_WINDOW_MS = 3e4;
const AUTH_DECISION_LOG_COALESCE_MAX_ENTRIES = 100;
/** Return whether fallback decision logging is enabled for warn-level events. */
function isModelFallbackDecisionLogEnabled() {
	return decisionLog.isEnabled("warn");
}
function buildErrorObservationFields(error) {
	const observed = buildTextObservationFields(error);
	return {
		errorPreview: observed.textPreview,
		errorHash: observed.textHash,
		errorFingerprint: observed.textFingerprint,
		httpCode: observed.httpCode,
		providerErrorType: observed.providerErrorType,
		providerErrorMessagePreview: observed.providerErrorMessagePreview,
		requestIdHash: observed.requestIdHash
	};
}
const authDecisionLogCoalesceEntries = /* @__PURE__ */ new Map();
function formatModelRef(candidate) {
	return `${candidate.provider}/${candidate.model}`;
}
function resolveAuthDecisionLogCoalescing(params, observedError) {
	if (params.decision !== "candidate_failed" && params.decision !== "skip_candidate" || params.reason !== "auth" && params.reason !== "auth_permanent") return { shouldLog: true };
	const now = Date.now();
	const key = JSON.stringify([
		params.sessionId ?? params.runId,
		params.lane,
		params.requestedProvider,
		params.requestedModel,
		params.decision,
		params.candidate.provider,
		params.candidate.model,
		params.candidate.routeOrigin,
		params.candidate.routeResolution,
		params.attempt,
		params.total,
		params.reason,
		params.status,
		params.code,
		observedError.httpCode,
		observedError.providerErrorType,
		observedError.errorFingerprint ?? observedError.errorHash,
		params.nextCandidate ? formatModelRef(params.nextCandidate) : null,
		params.nextCandidate ? params.nextCandidate.routeOrigin : null,
		params.nextCandidate ? params.nextCandidate.routeResolution : null,
		params.isPrimary,
		params.requestedModelMatched,
		params.fallbackConfigured
	]);
	const recent = authDecisionLogCoalesceEntries.get(key);
	const recentAgeMs = recent ? now - recent.lastLoggedAt : Infinity;
	if (recent && recentAgeMs < AUTH_DECISION_LOG_COALESCE_WINDOW_MS) {
		recent.suppressed += 1;
		return { shouldLog: false };
	}
	const staleWindowMs = AUTH_DECISION_LOG_COALESCE_WINDOW_MS * 2;
	const suppressedDuplicateCount = recentAgeMs < staleWindowMs ? recent?.suppressed : void 0;
	if (recentAgeMs >= staleWindowMs) authDecisionLogCoalesceEntries.delete(key);
	if (!authDecisionLogCoalesceEntries.has(key)) {
		for (const [entryKey, entry] of authDecisionLogCoalesceEntries) if (entry.lastLoggedAt < now - staleWindowMs) authDecisionLogCoalesceEntries.delete(entryKey);
		if (authDecisionLogCoalesceEntries.size >= AUTH_DECISION_LOG_COALESCE_MAX_ENTRIES) {
			let oldestKey;
			let oldestLoggedAt = Infinity;
			for (const [entryKey, entry] of authDecisionLogCoalesceEntries) if (entry.lastLoggedAt < oldestLoggedAt) {
				oldestLoggedAt = entry.lastLoggedAt;
				oldestKey = entryKey;
			}
			if (oldestKey !== void 0) authDecisionLogCoalesceEntries.delete(oldestKey);
		}
	}
	authDecisionLogCoalesceEntries.set(key, {
		lastLoggedAt: now,
		suppressed: 0
	});
	return {
		shouldLog: true,
		suppressedDuplicateCount
	};
}
function buildFallbackStepFields(params, detailText) {
	if (params.decision === "probe_cooldown_candidate") return;
	const succeeded = params.decision === "candidate_succeeded";
	const previous = succeeded ? params.previousAttempts?.at(-1) : void 0;
	if (succeeded && !previous) return;
	const from = previous ?? params.candidate;
	const to = succeeded ? params.candidate : params.nextCandidate;
	const reason = succeeded ? previous?.reason : params.reason;
	const detail = succeeded ? previous?.error : detailText;
	return {
		fallbackStepType: "fallback_step",
		fallbackStepFromModel: formatModelRef(from),
		...to ? { fallbackStepToModel: formatModelRef(to) } : {},
		...reason ? { fallbackStepFromFailureReason: reason } : {},
		...detail ? { fallbackStepFromFailureDetail: detail } : {},
		...typeof params.attempt === "number" ? { fallbackStepChainPosition: params.attempt } : {},
		fallbackStepFinalOutcome: succeeded ? "succeeded" : params.nextCandidate ? "next_fallback" : "chain_exhausted"
	};
}
function logModelFallbackDecision(params) {
	const explainedAttempt = params.decision === "candidate_succeeded" ? params.previousAttempts?.find((attempt) => attempt.reason === "context_overflow" || attempt.reason === "model_not_found") : void 0;
	if (explainedAttempt) {
		const reason = explainedAttempt.reason === "context_overflow" ? "exceeded its context window" : "not found";
		decisionLog.warn(`Model "${sanitizeForLog(formatModelRef(explainedAttempt))}" ${reason}. Fell back to "${sanitizeForLog(formatModelRef(params.candidate))}".`);
	}
	const nextText = params.nextCandidate ? `${sanitizeForLog(params.nextCandidate.provider)}/${sanitizeForLog(params.nextCandidate.model)}` : "none";
	const reasonText = params.reason ?? "unknown";
	const observedError = buildErrorObservationFields(params.error);
	const detailText = observedError.providerErrorMessagePreview ?? observedError.errorPreview;
	const fallbackStepFields = buildFallbackStepFields(params, detailText);
	const providerErrorTypeSuffix = observedError.providerErrorType ? ` providerErrorType=${sanitizeForLog(observedError.providerErrorType)}` : "";
	const detailSuffix = detailText ? ` detail=${sanitizeForLog(detailText)}` : "";
	const logCoalescing = resolveAuthDecisionLogCoalescing(params, observedError);
	if (!logCoalescing.shouldLog) return fallbackStepFields;
	const suppressedDuplicateCount = logCoalescing.suppressedDuplicateCount ?? 0;
	const suppressedSuffix = suppressedDuplicateCount > 0 ? ` (${suppressedDuplicateCount} duplicates suppressed in last ${AUTH_DECISION_LOG_COALESCE_WINDOW_MS / 1e3}s)` : "";
	decisionLog.warn("model fallback decision", {
		event: "model_fallback_decision",
		tags: [
			"error_handling",
			"model_fallback",
			params.decision
		],
		runId: params.runId,
		sessionId: params.sessionId,
		lane: params.lane,
		decision: params.decision,
		requestedProvider: params.requestedProvider,
		requestedModel: params.requestedModel,
		candidateProvider: params.candidate.provider,
		candidateModel: params.candidate.model,
		candidateRouteOrigin: params.candidate.routeOrigin,
		candidateRouteResolution: params.candidate.routeResolution,
		attempt: params.attempt,
		total: params.total,
		reason: params.reason,
		status: params.status,
		code: params.code,
		...observedError,
		...fallbackStepFields,
		nextCandidateProvider: params.nextCandidate?.provider,
		nextCandidateModel: params.nextCandidate?.model,
		nextCandidateRouteOrigin: params.nextCandidate?.routeOrigin,
		nextCandidateRouteResolution: params.nextCandidate?.routeResolution,
		isPrimary: params.isPrimary,
		requestedModelMatched: params.requestedModelMatched,
		fallbackConfigured: params.fallbackConfigured,
		allowTransientCooldownProbe: params.allowTransientCooldownProbe,
		profileCount: params.profileCount,
		...suppressedDuplicateCount > 0 ? { suppressedDuplicateCount } : {},
		previousAttempts: params.previousAttempts?.map((attempt) => ({
			provider: attempt.provider,
			model: attempt.model,
			reason: attempt.reason,
			status: attempt.status,
			code: attempt.code,
			...buildErrorObservationFields(attempt.error)
		})),
		consoleMessage: `model fallback decision: decision=${params.decision} requested=${sanitizeForLog(params.requestedProvider)}/${sanitizeForLog(params.requestedModel)} candidate=${sanitizeForLog(params.candidate.provider)}/${sanitizeForLog(params.candidate.model)} reason=${reasonText}${providerErrorTypeSuffix} next=${nextText}${detailSuffix}${suppressedSuffix}`
	});
	return fallbackStepFields;
}
/** Record a local or terminal stop separately from provider-failure decisions. */
function logModelFallbackChainStopped(params) {
	if (!decisionLog.isEnabled("warn")) return;
	let errorName;
	try {
		const name = params.error instanceof Error ? params.error.name : void 0;
		errorName = typeof name === "string" && name ? name : void 0;
	} catch {}
	decisionLog.warn("model fallback chain stopped", {
		event: "model_fallback_chain_stopped",
		tags: [
			"error_handling",
			"model_fallback",
			"chain_stopped"
		],
		sessionId: params.sessionId,
		lane: params.lane,
		reason: params.reason,
		candidateProvider: params.provider,
		candidateModel: params.model,
		errorName,
		consoleMessage: `model fallback chain stopped: reason=${params.reason} candidate=${sanitizeForLog(params.provider)}/${sanitizeForLog(params.model)}` + (errorName ? ` errorName=${sanitizeForLog(errorName)}` : "")
	});
}
//#endregion
//#region src/agents/model-fallback-attempt.ts
function isFallbackSummaryError(err) {
	return isFailoverError(err) && Array.isArray(err.attempts) && err.soonestCooldownExpiry !== void 0;
}
function resolveFallbackAuthScope(params) {
	return params.userLockedAuthProfileId || params.profileIds?.find((id) => id.trim())?.trim();
}
function isTranscriptNotContinuableError(err) {
	return Boolean(err) && typeof err === "object" && err.code === "openclaw_transcript_not_continuable";
}
function isTerminalAbortCandidate(candidate) {
	if (typeof candidate === "string") return isCronTerminalAbortReasonText(candidate);
	if (!(candidate instanceof Error)) return false;
	return isAgentRunRestartAbortReason(candidate) || candidate.name === "TimeoutError" || candidate.name === "ClientDisconnectError" || isCronTerminalAbortReasonText(candidate.message);
}
function isTerminalAbortFromError(err) {
	if (!(err instanceof Error)) return false;
	if (isAgentRunRestartAbortReason(err)) return true;
	if (err.name !== "AbortError") return false;
	const causeCandidates = [err.cause, err.cause instanceof Error ? err.cause.cause : void 0];
	if (causeCandidates.some(isAgentRunRestartAbortReason)) return true;
	return isOpenClawAbortableWrapper(err) && causeCandidates.some(isTerminalAbortCandidate);
}
/** Preserve stop precedence while naming the first matching condition. */
function resolveChainStopReason(params) {
	const { err } = params;
	if (findAgentRunTerminalOutcome(err)?.status === "timeout") return "agent_run_terminal_timeout";
	if (isCommandLaneTaskTimeoutError(err)) return "command_lane_task_timeout";
	if (params.harnessPreflight && !params.captureHarnessPreflight) return "agent_harness_preflight";
	if (isSandboxProvisioningError(err)) return "sandbox_provisioning";
	if (params.callerSignalAborted) return "caller_signal_aborted";
	if (isAgentRunDirectAbortReason(err)) return "agent_run_direct_abort";
	if (isAgentRunRestartAbortReason(err)) return "agent_run_restart_abort";
	return isAgentRunSupersededAbortReason(err) ? "agent_run_superseded_abort" : isSessionPlacementSettlementClosedError(err) ? "session_placement_settlement_closed" : isTerminalAbortFromError(err) ? "terminal_abort_wrapper" : void 0;
}
async function runFallbackCandidate(params) {
	try {
		const run = () => params.options ? params.run(params.provider, params.model, params.options) : params.run(params.provider, params.model);
		return {
			ok: true,
			result: params.deferSessionSuspension ? await runWithDeferredSessionSuspension(run, params.onDeferredSessionSuspension) : await run()
		};
	} catch (err) {
		const harnessPreflight = isAgentHarnessPreflightError(err);
		const chainStopReason = resolveChainStopReason({
			err,
			harnessPreflight,
			captureHarnessPreflight: params.captureHarnessPreflight,
			callerSignalAborted: params.abortSignal?.aborted === true
		});
		if (chainStopReason) {
			logModelFallbackChainStopped({
				reason: chainStopReason,
				provider: params.provider,
				model: params.model,
				sessionId: params.attribution?.sessionId,
				lane: params.attribution?.lane,
				error: err
			});
			throw err;
		}
		if (harnessPreflight) return {
			ok: false,
			error: err
		};
		const fallbackError = resolveModelFallbackError(err, {
			provider: params.provider,
			model: params.model,
			sessionId: params.attribution?.sessionId,
			lane: params.attribution?.lane
		});
		if (fallbackError.kind === "coordination") throw err;
		return {
			ok: false,
			error: fallbackError.error
		};
	}
}
async function runFallbackAttempt(params) {
	if (params.attempt > 1) {
		params.abortSignal?.throwIfAborted();
		renewAgentRunDeadline(params.attribution?.runId);
	}
	const runResult = await runFallbackCandidate(params);
	const classification = runResult.ok ? await params.classifyResult?.({
		result: runResult.result,
		provider: params.provider,
		model: params.model,
		attempt: params.attempt,
		total: params.total
	}) : void 0;
	const attemptError = runResult.ok ? resolveResultClassificationError(classification, params) : runResult.error;
	if (runResult.ok && attemptError && params.abortSignal?.aborted) throw toErrorObject(attemptError, "Non-Error thrown");
	if (hasModelFallbackStop(attemptError)) throw attemptError;
	if (!runResult.ok) return { error: runResult.error };
	const buildClassifiedResult = () => ({
		result: runResult.result,
		provider: params.provider,
		model: params.model
	});
	if (!attemptError) {
		const stopReason = classification && "stopReason" in classification ? classification.stopReason : void 0;
		if (stopReason && params.total > 1) logModelFallbackChainStopped({
			reason: stopReason,
			provider: params.provider,
			model: params.model,
			...params.attribution
		});
		return {
			...stopReason ? { stopped: true } : {},
			success: {
				outcome: "completed",
				...buildClassifiedResult(),
				attempts: params.attempts
			}
		};
	}
	const preserveResultOnExhaustion = classification && "preserveResultOnExhaustion" in classification && classification.preserveResultOnExhaustion === true;
	return {
		error: attemptError,
		classifiedResult: buildClassifiedResult(),
		...preserveResultOnExhaustion ? { exhaustionResult: {
			...buildClassifiedResult(),
			priority: typeof classification.preserveResultPriority === "number" && Number.isFinite(classification.preserveResultPriority) ? classification.preserveResultPriority : 0
		} } : {}
	};
}
function resolveResultClassificationError(classification, params) {
	if (!classification || "stopReason" in classification) return null;
	if ("error" in classification) return classification.error;
	const message = normalizeOptionalString(classification.message);
	return message ? new FailoverError(message, {
		reason: classification.reason ?? "unknown",
		provider: params.provider,
		model: params.model,
		sessionId: params.attribution?.sessionId,
		lane: params.attribution?.lane,
		status: classification.status,
		code: classification.code,
		rawError: classification.rawError,
		rateLimitRetriesExhausted: classification.rateLimitRetriesExhausted
	}) : null;
}
function resolveNextFallbackCandidateIndex(params) {
	for (let index = params.currentIndex + 1; index < params.candidates.length; index += 1) {
		const candidate = params.candidates[index];
		if (candidate && !params.excludedProviders.has(candidate.provider)) return index;
	}
	return params.candidates.length;
}
async function resolveModelFallbackCandidateHarnessAuthPrecheck(params) {
	const { agentHarnessRuntimeOverride, explicitAgentRuntime, runtime, runtimeSource } = resolveModelFallbackCandidateAgentRuntime(params);
	const result = (skipsProviderAuthCooldown) => ({
		skipsProviderAuthCooldown,
		agentHarnessRuntimeOverride
	});
	if (!params.cfg) return result(false);
	if (!explicitAgentRuntime && isCliProvider(params.provider, params.cfg)) return result(true);
	if (!runtime) return result(false);
	if (runtime === "openclaw" || runtime === "auto" || runtime === "codex" && runtimeSource === "implicit") return result(false);
	await params.prepareAgentHarnessRuntime?.({
		provider: params.provider,
		model: params.model,
		agentHarnessRuntimeOverride
	});
	if (getRegisteredAgentHarness(runtime)) return result(true);
	const cliRuntime = normalizeOptionalString(runtime);
	if (cliRuntime && (isCliRuntimeAlias(cliRuntime) || isCliProvider(cliRuntime, params.cfg))) return result(true);
	throw new MissingAgentHarnessError(runtime);
}
function resolveModelFallbackCandidateAgentRuntime(params) {
	const agentHarnessRuntimeOverride = params.resolveAgentHarnessRuntimeOverride?.(params.provider, params.model);
	const agentRuntimeOverride = normalizeOptionalAgentRuntimeId(agentHarnessRuntimeOverride);
	const explicitAgentRuntime = agentRuntimeOverride && !isDefaultAgentRuntimeId(agentRuntimeOverride) ? agentRuntimeOverride : void 0;
	if (!params.cfg) return {
		agentHarnessRuntimeOverride,
		explicitAgentRuntime,
		runtime: explicitAgentRuntime
	};
	const harnessPolicy = resolveAgentHarnessPolicy({
		provider: params.provider,
		modelId: params.model,
		config: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	return {
		agentHarnessRuntimeOverride,
		explicitAgentRuntime,
		runtime: explicitAgentRuntime ?? harnessPolicy.runtime,
		runtimeSource: explicitAgentRuntime ? "model" : harnessPolicy.runtimeSource
	};
}
function buildFailedCandidateAttempt(candidate, described) {
	return {
		provider: candidate.provider,
		model: candidate.model,
		error: described.rawError && (!described.provider || described.provider === candidate.provider && (!described.model || described.model === candidate.model)) ? described.rawError : described.message,
		reason: described.reason ?? "unknown",
		rateLimitRetriesExhausted: described.rateLimitRetriesExhausted,
		authMode: described.authMode,
		status: described.status,
		code: described.code
	};
}
function recordFailedCandidateAttempt(params) {
	const { attempts, error, ...observation } = params;
	const described = describeFailoverError(error);
	const attempt = buildFailedCandidateAttempt(params.candidate, described);
	attempts.push(attempt);
	return logModelFallbackDecision({
		...observation,
		decision: "candidate_failed",
		requestedProvider: params.requestedProvider ?? params.candidate.provider,
		requestedModel: params.requestedModel ?? params.candidate.model,
		reason: described.reason,
		status: described.status,
		code: described.code,
		error: attempt.error
	});
}
function appendFailedCandidateAttempt(params) {
	const described = describeFailoverError(params.error);
	params.attempts.push(buildFailedCandidateAttempt(params.candidate, described));
}
function resolveLiveSessionModelSwitchRedirectIndex(params) {
	const targetKey = modelKey(params.error.provider, params.error.model);
	const targetIndex = params.candidates.findIndex((candidate) => modelKey(candidate.provider, candidate.model) === targetKey);
	if (targetIndex === -1) throw params.error;
	return targetIndex > params.currentIndex ? targetIndex : null;
}
function hasDifferentLiveSessionRuntimeSelection(params) {
	const normalizeRuntime = (runtime) => {
		const normalized = normalizeOptionalAgentRuntimeId(runtime);
		return normalized && !isDefaultAgentRuntimeId(normalized) ? normalized : void 0;
	};
	return normalizeRuntime(params.currentAgentHarnessRuntimeOverride) !== normalizeRuntime(params.error.agentRuntimeOverride);
}
function throwFallbackFailureSummary(params) {
	if (params.attempts.length <= 1 && params.lastError) throw toErrorObject(params.lastError, "Non-Error thrown");
	if (params.attribution?.sessionId) suspendSession({
		cfg: params.cfg,
		agentId: params.agentId,
		agentDir: params.agentDir,
		sessionId: params.attribution.sessionId,
		reason: "circuit_open",
		failedProvider: params.attempts.at(-1)?.provider ?? "unknown",
		failedModel: params.attempts.at(-1)?.model ?? "unknown"
	});
	const summary = params.attempts.length > 0 ? params.attempts.map(params.formatAttempt).join(" | ") : "unknown";
	const remediation = buildFailoverRemediationHint(params.lastError);
	const message = `All ${params.label} failed (${params.attempts.length || params.candidates.length}): ${summary}${remediation ? `. ${remediation}` : ""}`;
	const attempts = params.attempts.map((attempt) => ({
		...attempt,
		reason: attempt.reason ?? "unknown"
	}));
	const lastAttempt = attempts.at(-1);
	throw new FailoverError(message, {
		reason: lastAttempt?.reason ?? "unknown",
		provider: lastAttempt?.provider,
		model: lastAttempt?.model,
		authMode: lastAttempt?.authMode,
		status: lastAttempt?.status,
		rateLimitRetriesExhausted: lastAttempt?.rateLimitRetriesExhausted,
		code: lastAttempt?.code,
		cause: params.lastError instanceof Error ? params.lastError : void 0,
		sessionId: params.attribution?.sessionId,
		lane: params.attribution?.lane,
		attempts,
		soonestCooldownExpiry: params.soonestCooldownExpiry ?? null
	});
}
async function resolveFallbackSoonestCooldownExpiry(params) {
	if (!params.authRuntime || params.profileIdsByCandidate.size === 0) return null;
	const refreshedStore = await params.authRuntime.loadAuthProfileStoreForRuntimeAsync(params.agentDir, {
		readOnly: true,
		profileId: params.userLockedAuthProfileId,
		externalCli: externalCliDiscoveryForProviders({
			cfg: params.cfg,
			providers: [...params.profileIdsByCandidate.keys()].map((candidate) => candidate.provider)
		})
	});
	let soonest = null;
	for (const [candidate, ids] of params.profileIdsByCandidate) {
		const candidateSoonest = params.authRuntime.getSoonestCooldownExpiry(refreshedStore, ids, { forModel: candidate.model });
		if (typeof candidateSoonest === "number" && Number.isFinite(candidateSoonest) && (soonest === null || candidateSoonest < soonest)) soonest = candidateSoonest;
	}
	return soonest;
}
function shouldDiscardDeferredSessionSuspension(params) {
	if (params.abortSignal?.aborted || findAgentRunTerminalOutcome(params.error)?.status === "timeout" || isAgentRunDirectAbortReason(params.error) || isAgentRunRestartAbortReason(params.error) || isAgentRunSupersededAbortReason(params.error) || isSessionPlacementSettlementClosedError(params.error) || isTerminalAbortFromError(params.error) || isCommandLaneTaskTimeoutError(params.error)) return true;
	const resolution = resolveModelFallbackError(params.error);
	return resolution.kind === "coordination" || resolution.kind !== "terminal" && (isTranscriptNotContinuableError(params.error) || isLikelyContextOverflowError(formatErrorMessage(params.error)));
}
//#endregion
export { recordFailedCandidateAttempt as a, resolveLiveSessionModelSwitchRedirectIndex as c, resolveNextFallbackCandidateIndex as d, runFallbackAttempt as f, logModelFallbackDecision as g, isModelFallbackDecisionLogEnabled as h, isTranscriptNotContinuableError as i, resolveModelFallbackCandidateAgentRuntime as l, throwFallbackFailureSummary as m, hasDifferentLiveSessionRuntimeSelection as n, resolveFallbackAuthScope as o, shouldDiscardDeferredSessionSuspension as p, isFallbackSummaryError as r, resolveFallbackSoonestCooldownExpiry as s, appendFailedCandidateAttempt as t, resolveModelFallbackCandidateHarnessAuthPrecheck as u };
