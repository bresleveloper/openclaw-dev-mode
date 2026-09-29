import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { F as parseApiErrorInfo, _ as redactSensitiveText, i as getDefaultRedactPatterns, q as readLoggingConfig } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as redactIdentifier } from "./node-crypto-Df3MIs6V.mjs";
import "./model-ref-shared-BgRrSHjn.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-DYrfsfP0.mjs";
import { r as externalCliDiscoveryForProviders } from "./external-cli-discovery-BbOBKQM3.mjs";
import { n as getRegisteredAgentHarness } from "./registry-aYyey5ds.mjs";
import { s as isCliProvider } from "./model-selection-CaFyCMqp.mjs";
import { a as isFailoverError, t as FailoverError } from "./error-ON38hPhx.mjs";
import { i as isAgentHarnessPreflightError, r as MissingAgentHarnessError } from "./errors-Bd6GQRkh.mjs";
import { r as isCliRuntimeAlias } from "./model-runtime-aliases-CJA2j26Y.mjs";
import { d as isAgentRunSupersededAbortReason, f as isSessionPlacementSettlementClosedError, l as isAgentRunDirectAbortReason, u as isAgentRunRestartAbortReason } from "./run-termination-Cd1iJzC7.mjs";
import { s as getApiErrorPayloadFingerprint } from "./user-copy-DfLWtdTx.mjs";
import { l as isCommandLaneTaskTimeoutError } from "./command-queue-CaY517ob.mjs";
import "./errors-wmH7Ncz4.mjs";
import { n as isCronTerminalAbortReasonText } from "./execution-errors-BJ-OuMcK.mjs";
import { n as findAgentRunTerminalOutcome } from "./agent-run-terminal-error-C7q9VIgV.mjs";
import { i as isOpenClawAbortableWrapper } from "./abortable-lNbmO-u0.mjs";
import { a as isLikelyContextOverflowError } from "./classify-DO9EO_30.mjs";
import { i as describeFailoverError, m as resolveModelFallbackError, s as hasModelFallbackStop, t as buildFailoverRemediationHint } from "./failover-error-C3SnWYBJ.mjs";
import { g as classifyProviderRuntimeFailureKind } from "./embedded-agent-helpers-DGdaNc6w.mjs";
import { n as isSandboxProvisioningError } from "./provisioning-error-uEcyhdqf.mjs";
import { a as runWithDeferredSessionSuspension, o as suspendSession } from "./session-suspension-DbQ3XvjC.mjs";
//#region src/agents/embedded-agent-error-observation.ts
/**
* Builds structured observations for embedded-agent API/text failures.
*/
const MAX_OBSERVATION_INPUT_CHARS = 64e3;
const MAX_FINGERPRINT_MESSAGE_CHARS = 8e3;
const RAW_ERROR_PREVIEW_MAX_CHARS = 400;
const PROVIDER_ERROR_PREVIEW_MAX_CHARS = 200;
const REQUEST_ID_RE = /\brequest[_ ]?id\b\s*[:=]\s*["'()]*([A-Za-z0-9._:-]+)/i;
const OBSERVATION_EXTRA_REDACT_PATTERNS = [
	String.raw`\b(?:x-)?api[-_]?key\b\s*[:=]\s*(["']?)([^\s"'\\;]+)\1`,
	String.raw`"(?:api[-_]?key|api_key)"\s*:\s*"([^"]+)"`,
	String.raw`(?:\bCookie\b\s*[:=]\s*[^;=\s]+=|;\s*[^;=\s]+=)([^;\s\r\n]+)`
];
const RAW_ERROR_CONSOLE_SUPPRESSED_FAILURE_KINDS = /* @__PURE__ */ new Set([
	"auth_html",
	"auth_refresh",
	"auth_scope",
	"upstream_html"
]);
function resolveConfiguredRedactPatterns() {
	const configured = readLoggingConfig()?.redactPatterns;
	if (!Array.isArray(configured)) return [];
	return configured.filter((pattern) => typeof pattern === "string");
}
function truncateForObservation(text, maxChars) {
	const trimmed = text?.trim();
	if (!trimmed) return;
	return trimmed.length > maxChars ? `${truncateUtf16Safe(trimmed, maxChars)}…` : trimmed;
}
function boundObservationInput(text) {
	const trimmed = text?.trim();
	if (!trimmed) return;
	return trimmed.length > MAX_OBSERVATION_INPUT_CHARS ? truncateUtf16Safe(trimmed, MAX_OBSERVATION_INPUT_CHARS) : trimmed;
}
function replaceRequestIdPreview(text, requestId) {
	if (!text || !requestId) return text;
	return text.split(requestId).join(redactIdentifier(requestId, { len: 12 }));
}
function redactObservationText(text) {
	if (!text) return text;
	const configuredPatterns = resolveConfiguredRedactPatterns();
	return redactSensitiveText(text, {
		mode: "tools",
		patterns: [
			...getDefaultRedactPatterns(),
			...configuredPatterns,
			...OBSERVATION_EXTRA_REDACT_PATTERNS
		]
	});
}
function shouldSuppressRawErrorConsoleSuffix(providerRuntimeFailureKind) {
	return providerRuntimeFailureKind ? RAW_ERROR_CONSOLE_SUPPRESSED_FAILURE_KINDS.has(providerRuntimeFailureKind) : false;
}
function buildObservationFingerprint(params) {
	const boundedMessage = params.message && params.message.length > MAX_FINGERPRINT_MESSAGE_CHARS ? truncateUtf16Safe(params.message, MAX_FINGERPRINT_MESSAGE_CHARS) : params.message;
	const structured = params.httpCode || params.type || boundedMessage ? stableStringify({
		httpCode: params.httpCode,
		type: params.type,
		message: boundedMessage
	}) : null;
	if (structured) return structured;
	if (params.requestId) return params.raw.split(params.requestId).join("<request_id>");
	return getApiErrorPayloadFingerprint(params.raw);
}
function buildApiErrorObservationFields(rawError, opts) {
	const trimmed = boundObservationInput(rawError);
	if (!trimmed) return {};
	try {
		const parsed = parseApiErrorInfo(trimmed);
		const requestId = parsed?.requestId ?? normalizeOptionalString(trimmed.match(REQUEST_ID_RE)?.[1]);
		const requestIdHash = requestId ? redactIdentifier(requestId, { len: 12 }) : void 0;
		const rawFingerprint = buildObservationFingerprint({
			raw: trimmed,
			requestId,
			httpCode: parsed?.httpCode,
			type: parsed?.type,
			message: parsed?.message
		});
		const redactedRawPreview = replaceRequestIdPreview(redactObservationText(trimmed), requestId);
		const redactedProviderMessage = replaceRequestIdPreview(redactObservationText(parsed?.message), requestId);
		return {
			rawErrorPreview: truncateForObservation(redactedRawPreview, RAW_ERROR_PREVIEW_MAX_CHARS),
			rawErrorHash: redactIdentifier(trimmed, { len: 12 }),
			rawErrorFingerprint: rawFingerprint ? redactIdentifier(rawFingerprint, { len: 12 }) : void 0,
			httpCode: parsed?.httpCode,
			providerRuntimeFailureKind: classifyProviderRuntimeFailureKind({
				status: parsed?.httpCode ? Number(parsed.httpCode) : void 0,
				message: trimmed,
				provider: opts?.providerOwner?.id ?? opts?.provider
			}, { providerPlugin: opts?.providerOwner ?? null }),
			providerErrorType: redactObservationText(parsed?.type),
			providerErrorMessagePreview: truncateForObservation(redactedProviderMessage, PROVIDER_ERROR_PREVIEW_MAX_CHARS),
			requestIdHash
		};
	} catch {
		return {};
	}
}
function buildTextObservationFields(text, opts) {
	const observed = buildApiErrorObservationFields(text, opts);
	return {
		textPreview: observed.rawErrorPreview,
		textHash: observed.rawErrorHash,
		textFingerprint: observed.rawErrorFingerprint,
		httpCode: observed.httpCode,
		providerRuntimeFailureKind: observed.providerRuntimeFailureKind,
		providerErrorType: observed.providerErrorType,
		providerErrorMessagePreview: observed.providerErrorMessagePreview,
		requestIdHash: observed.requestIdHash
	};
}
//#endregion
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
function isAuthDecisionLogCoalescingEligible(params) {
	return (params.decision === "candidate_failed" || params.decision === "skip_candidate") && (params.reason === "auth" || params.reason === "auth_permanent");
}
function buildAuthDecisionLogCoalesceKey(params, observedError) {
	return JSON.stringify([
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
}
function pruneAuthDecisionLogCoalesceEntries(now) {
	const staleBefore = now - AUTH_DECISION_LOG_COALESCE_WINDOW_MS * 2;
	for (const [key, entry] of authDecisionLogCoalesceEntries) if (entry.lastLoggedAt < staleBefore) authDecisionLogCoalesceEntries.delete(key);
}
function evictOldestAuthDecisionLogCoalesceEntry() {
	let oldestKey;
	let oldestLoggedAt = Infinity;
	for (const [key, entry] of authDecisionLogCoalesceEntries) if (entry.lastLoggedAt < oldestLoggedAt) {
		oldestLoggedAt = entry.lastLoggedAt;
		oldestKey = key;
	}
	if (oldestKey !== void 0) authDecisionLogCoalesceEntries.delete(oldestKey);
}
function rememberAuthDecisionLogCoalesceEntry(key, now) {
	if (!authDecisionLogCoalesceEntries.has(key)) {
		pruneAuthDecisionLogCoalesceEntries(now);
		if (authDecisionLogCoalesceEntries.size >= AUTH_DECISION_LOG_COALESCE_MAX_ENTRIES) evictOldestAuthDecisionLogCoalesceEntry();
	}
	authDecisionLogCoalesceEntries.set(key, {
		lastLoggedAt: now,
		suppressed: 0
	});
}
function resolveAuthDecisionLogCoalescing(params, observedError) {
	if (!isAuthDecisionLogCoalescingEligible(params)) return { shouldLog: true };
	const now = Date.now();
	const key = buildAuthDecisionLogCoalesceKey(params, observedError);
	const recent = authDecisionLogCoalesceEntries.get(key);
	const recentAgeMs = recent ? now - recent.lastLoggedAt : void 0;
	if (recent && recentAgeMs !== void 0 && recentAgeMs >= AUTH_DECISION_LOG_COALESCE_WINDOW_MS * 2) {
		authDecisionLogCoalesceEntries.delete(key);
		rememberAuthDecisionLogCoalesceEntry(key, now);
		return { shouldLog: true };
	}
	if (recent && recentAgeMs !== void 0 && recentAgeMs < AUTH_DECISION_LOG_COALESCE_WINDOW_MS) {
		recent.suppressed += 1;
		return { shouldLog: false };
	}
	const suppressedDuplicateCount = recent?.suppressed;
	rememberAuthDecisionLogCoalesceEntry(key, now);
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
	if (params.attempt > 1) params.abortSignal?.throwIfAborted();
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
				result: runResult.result,
				provider: params.provider,
				model: params.model,
				attempts: params.attempts
			}
		};
	}
	const preserveResultOnExhaustion = classification && "preserveResultOnExhaustion" in classification && classification.preserveResultOnExhaustion === true;
	return {
		error: attemptError,
		classifiedResult: {
			result: runResult.result,
			provider: params.provider,
			model: params.model
		},
		...preserveResultOnExhaustion ? { exhaustionResult: {
			result: runResult.result,
			provider: params.provider,
			model: params.model,
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
		rawError: classification.rawError
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
		authMode: described.authMode,
		status: described.status,
		code: described.code
	};
}
function recordFailedCandidateAttempt(params) {
	const described = describeFailoverError(params.error);
	const attempt = buildFailedCandidateAttempt(params.candidate, described);
	params.attempts.push(attempt);
	return logModelFallbackDecision({
		decision: "candidate_failed",
		runId: params.runId,
		sessionId: params.sessionId,
		lane: params.lane,
		requestedProvider: params.requestedProvider ?? params.candidate.provider,
		requestedModel: params.requestedModel ?? params.candidate.model,
		candidate: params.candidate,
		attempt: params.attempt,
		total: params.total,
		reason: described.reason,
		status: described.status,
		code: described.code,
		error: attempt.error,
		nextCandidate: params.nextCandidate,
		isPrimary: params.isPrimary,
		requestedModelMatched: params.requestedModelMatched,
		fallbackConfigured: params.fallbackConfigured
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
		code: lastAttempt?.code,
		cause: params.lastError instanceof Error ? params.lastError : void 0,
		sessionId: params.attribution?.sessionId,
		lane: params.attribution?.lane,
		attempts,
		soonestCooldownExpiry: params.soonestCooldownExpiry ?? null
	});
}
function resolveFallbackSoonestCooldownExpiry(params) {
	if (!params.authRuntime || params.profileIdsByCandidate.size === 0) return null;
	const refreshedStore = params.authRuntime.loadAuthProfileStoreForRuntime(params.agentDir, {
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
export { buildApiErrorObservationFields as _, recordFailedCandidateAttempt as a, resolveLiveSessionModelSwitchRedirectIndex as c, resolveNextFallbackCandidateIndex as d, runFallbackAttempt as f, logModelFallbackDecision as g, isModelFallbackDecisionLogEnabled as h, isTranscriptNotContinuableError as i, resolveModelFallbackCandidateAgentRuntime as l, throwFallbackFailureSummary as m, hasDifferentLiveSessionRuntimeSelection as n, resolveFallbackAuthScope as o, shouldDiscardDeferredSessionSuspension as p, isFallbackSummaryError as r, resolveFallbackSoonestCooldownExpiry as s, appendFailedCandidateAttempt as t, resolveModelFallbackCandidateHarnessAuthPrecheck as u, buildTextObservationFields as v, shouldSuppressRawErrorConsoleSuffix as y };
