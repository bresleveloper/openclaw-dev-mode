import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { C as parseStrictNonNegativeInteger } from "./number-coercion-CkhMiRw8.mjs";
import { l as readErrorName, r as collectErrorGraphCandidates } from "./error-coercion-BwMr25F8.mjs";
import { i as asOptionalObjectRecord, u as readStringField } from "./record-coerce-TIsquoVR.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-D6DKCpwE.mjs";
import "./errors-DPfGDWk1.mjs";
import { i as isSqliteTranscriptMutationConflict } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { E as isAgentRunStaleLifecycleError } from "./agent-events-Bf3Js0D3.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { v as resolveExecutionApprovalFailureMessage } from "./message-patterns-DSkmGYcR.mjs";
import { c as isTimeoutError, l as readDirectErrorCode, n as FailoverError, o as isFailoverError, r as findErrorProperty, u as readDirectErrorMessage } from "./error-Bcp4ZyOv.mjs";
import { d as isAgentRunSupersededAbortReason, f as isSessionPlacementSettlementClosedError } from "./run-termination-Dwf1ksjA.mjs";
import { s as isSessionWorkStartInvalidatedError } from "./work-start-error-BI-UhSB2.mjs";
import { S as renderRateLimitRetryExhaustion } from "./user-copy-BAz4s3EV.mjs";
import { a as failoverReasonFromClassification, d as isUnclassifiedNoBodyHttpSignal } from "./classification-rules-CaFCPBKV.mjs";
import { d as extractFailoverSignalDetails } from "./assistant-request-failure-copy-csnSONXK.mjs";
import { a as isAgentHarnessPreflightError, r as AgentHarnessSessionSupersededError } from "./errors-BAipjK5G.mjs";
import { t as isRecordedModelFallbackStop } from "./model-fallback-stop-BtVvqU7l.mjs";
import { n as copyErrorDiagnostic } from "./error-diagnostics-Cgksm9ND.mjs";
import { t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime-admission-errors-DFzPwru3.mjs";
import { s as isChannelRunAuthorizationError } from "./host-context-builder-2jolfam-.mjs";
import { n as classifyFailoverSignal } from "./classify-PIr_bdgF.mjs";
import "./prepared-model-runtime.errors-DCd9wajc.mjs";
import { t as isSessionTranscriptTurnMismatchErrorMessage } from "./transcript-turn-error-B3HTXnww.mjs";
//#region src/agents/failover-error.ts
const MAX_FAILOVER_CAUSE_DEPTH = 25;
const MISSING_TOOL_RESULT_REASON = "missing_tool_result";
const MISSING_TOOL_RESULT_TEXT_RE = /native Codex tool\.call without a matching tool\.result/i;
const RUNTIME_COORDINATION_ERROR_NAMES = /* @__PURE__ */ new Set([
	"SessionCapabilityMetadataChangedError",
	"CodexNodeExecServerDisconnectedError",
	"GatewayDrainingError",
	"NodeRunnerUpdateRequiredError",
	"WorkerRunnerUnavailableError",
	"WorkerRunnerCapacityError",
	"WorkerWorkspaceReconciliationError",
	"ActiveTurnClaimError",
	"CliHistoryOwnerChangedError",
	"SessionTranscriptReadFenceError",
	"SqliteWorkerError"
]);
function hasRecordedModelFallbackStop(error) {
	return collectErrorGraphCandidates(error, resolveNestedErrors).some(isRecordedModelFallbackStop);
}
function hasModelFallbackStop(error) {
	return isSessionPlacementSettlementClosedError(error) || isAgentRunSupersededAbortReason(error) || collectErrorGraphCandidates(error, resolveNestedErrors).some((candidate) => isRecordedModelFallbackStop(candidate) || isSessionTranscriptTurnMismatchErrorMessage(readDirectErrorMessage(candidate)) || isFailoverError(candidate) && isCliTerminalStopCode(candidate.code));
}
function resolveNestedErrors(candidate) {
	const errors = candidate.errors;
	const nested = [
		candidate.error,
		candidate.cause,
		...Array.isArray(errors) ? errors : []
	];
	try {
		nested.push(candidate.suppressed);
	} catch {}
	return nested;
}
function findCliFailoverError(err, match, seen) {
	const direct = isFailoverError(err) ? match(err) : void 0;
	if (direct) return direct;
	if (!err || typeof err !== "object" || seen.has(err)) return;
	seen.add(err);
	for (const value of resolveNestedErrors(err)) {
		const found = findCliFailoverError(value, match, seen);
		if (found) return found;
	}
}
const CLI_TERMINAL_STOP_CODES = /* @__PURE__ */ new Set(["cli_max_turns", "cli_turn_stopped"]);
function isCliTerminalStopCode(code) {
	return code !== void 0 && CLI_TERMINAL_STOP_CODES.has(code);
}
function findCliTerminalStopError(err) {
	return findCliFailoverError(err, (error) => isCliTerminalStopCode(error.code) ? error : void 0, /* @__PURE__ */ new Set());
}
function hasCliTimeoutContext(error) {
	const context = error.cliTimeout;
	return Boolean(context && (context.mode === "overall" || context.mode === "no-output") && Number.isFinite(context.timeoutSeconds) && context.timeoutSeconds >= 0 && typeof context.observedActivity === "boolean" && Number.isInteger(context.activeToolCount) && context.activeToolCount >= 0 && Number.isInteger(context.backgroundTaskCount) && context.backgroundTaskCount >= 0);
}
function findCliTimeoutError(err) {
	return findCliFailoverError(err, (error) => hasCliTimeoutContext(error) ? error : void 0, /* @__PURE__ */ new Set());
}
/** Map a failover reason to the closest HTTP-like status code. */
function resolveFailoverStatus(reason, code) {
	return normalizeFailoverStatus(FAILOVER_STATUS.get(reason), code);
}
function normalizeFailoverStatus(status, code) {
	return code === "selected_auth_profile_unavailable" ? void 0 : status;
}
const FAILOVER_STATUS = /* @__PURE__ */ new Map([
	["billing", 402],
	["server_error", 500],
	["rate_limit", 429],
	["overloaded", 503],
	["auth", 401],
	["auth_permanent", 403],
	["timeout", 408],
	["tls_certificate", 502],
	["context_overflow", 413],
	["format", 400],
	["model_not_found", 404],
	["session_expired", 410]
]);
function readDirectStatusCode(err) {
	const record = asOptionalObjectRecord(err);
	const candidate = record?.status ?? record?.statusCode;
	if (typeof candidate === "number") return candidate;
	if (typeof candidate === "string") return parseStrictNonNegativeInteger(candidate);
}
function readStableProviderErrorType(raw) {
	const value = raw.trim();
	return /^[A-Z][A-Z0-9_:-]*$/.test(value) && !/^(?:api|authentication|invalid_request|not_found|overloaded|permission|rate_limit|server)_error$/i.test(value) ? value : void 0;
}
function readDirectErrorType(err) {
	const record = asOptionalObjectRecord(err);
	if (!record) return;
	const directType = record.errorType;
	if (typeof directType === "string") return readStableProviderErrorType(directType);
	const detailType = record.detail?.type;
	if (typeof detailType === "string") return readStableProviderErrorType(detailType);
	const type = normalizeOptionalString(record.type);
	return type && !/^(?:error|exception)$/i.test(type) ? readStableProviderErrorType(type) : void 0;
}
function readDirectProvider(err) {
	return normalizeOptionalString(asOptionalObjectRecord(err)?.provider);
}
function readDirectErrorDetails(err) {
	const candidate = asOptionalObjectRecord(err);
	if (!candidate) return;
	return extractFailoverSignalDetails(candidate.param, candidate.errorBody, candidate.body, candidate.detail, candidate.error);
}
function hasSessionTranscriptWriterClaimRebound(err, seen = /* @__PURE__ */ new Set()) {
	if (readErrorName(err) === "SessionTranscriptWriterClaimReboundError") return true;
	const candidate = asOptionalObjectRecord(err);
	if (!candidate || seen.has(candidate)) return false;
	seen.add(candidate);
	return hasSessionTranscriptWriterClaimRebound(candidate.error, seen) || hasSessionTranscriptWriterClaimRebound(candidate.cause, seen) || hasSessionTranscriptWriterClaimRebound(candidate.reason, seen);
}
function readMissingToolResultMarker(err) {
	const message = readDirectErrorMessage(err);
	if (message && MISSING_TOOL_RESULT_TEXT_RE.test(message)) return true;
	const record = asOptionalObjectRecord(err);
	for (const key of [
		"code",
		"reason",
		"status"
	]) if (readStringField(record, key)?.trim() === MISSING_TOOL_RESULT_REASON) return true;
	const output = readStringField(record, "output");
	if (output && MISSING_TOOL_RESULT_TEXT_RE.test(output)) return true;
	const resultReason = readStringField(asOptionalObjectRecord(record?.result), "reason");
	const detailReason = readStringField(asOptionalObjectRecord(record?.detail), "reason");
	if (resultReason === MISSING_TOOL_RESULT_REASON || detailReason === MISSING_TOOL_RESULT_REASON) return true;
}
function hasMissingToolResultFailure(err) {
	return findErrorProperty(err, readMissingToolResultMarker) === true;
}
function hasStaleAgentRunLifecycleFailure(err) {
	return findErrorProperty(err, (candidate) => isAgentRunStaleLifecycleError(candidate) ? true : void 0) === true;
}
function hasRuntimeCoordinationFailure(err) {
	if (isChannelRunAuthorizationError(err)) return true;
	return collectErrorGraphCandidates(err, resolveNestedErrors).some((candidate) => isSessionWorkStartInvalidatedError(candidate) || RUNTIME_COORDINATION_ERROR_NAMES.has(readErrorName(candidate)) || resolveExecutionApprovalFailureMessage(readDirectErrorMessage(candidate)) !== void 0);
}
function hasPreparedModelRuntimeOwnerNotPublished(err) {
	return collectErrorGraphCandidates(err, resolveNestedErrors).some((candidate) => candidate instanceof PreparedModelRuntimeOwnerNotPublishedError);
}
/** A local worker-task deadline is runtime infrastructure failure, not a provider timeout. */
function hasLocalWorkerTaskTimeout(err) {
	let localTimeout = false;
	for (const candidate of collectErrorGraphCandidates(err, resolveNestedErrors)) {
		if (isFailoverError(candidate)) continue;
		const record = asOptionalObjectRecord(candidate);
		if (record?.status !== void 0 || record?.statusCode !== void 0) return false;
		if (readErrorName(candidate) === "WorkerTaskError" && readStringField(record, "code") === "timeout") localTimeout = true;
	}
	return localTimeout;
}
function hasDirectProviderFailureIdentity(err) {
	if (isFailoverError(err)) return true;
	const signal = normalizeErrorSignal(err, void 0, "direct");
	return Boolean(signal.status || signal.code || signal.errorType || signal.provider);
}
/** Local coordination failures stop fallback because changing models cannot repair them. */
function isNonProviderRuntimeCoordinationError(err) {
	return resolveModelFallbackError(err).kind === "coordination";
}
function normalizeErrorSignal(err, providerHint, scope = "nested") {
	const read = (reader) => scope === "direct" ? reader(err) : findErrorProperty(err, reader);
	const message = read(readDirectErrorMessage);
	const code = read(readDirectErrorCode);
	return {
		status: normalizeFailoverStatus(read(readDirectStatusCode), code),
		code,
		errorType: read(readDirectErrorType),
		message: message || void 0,
		provider: read(readDirectProvider) ?? providerHint,
		details: readDirectErrorDetails(err)
	};
}
function getNestedErrorCandidates(err) {
	const candidate = asOptionalObjectRecord(err);
	return [candidate?.error, candidate?.cause].filter((value) => value !== void 0 && value !== err);
}
function isFormatClassification(classification) {
	return classification?.kind === "reason" && classification.reason === "format";
}
function decideNestedFormatOverride(candidate, inheritedStatus, seen, depth) {
	if (depth > MAX_FAILOVER_CAUSE_DEPTH) return null;
	if (candidate && typeof candidate === "object") {
		if (seen.has(candidate)) return null;
		seen.add(candidate);
	}
	const directSignal = normalizeErrorSignal(candidate, void 0, "direct");
	const nestedCandidates = getNestedErrorCandidates(candidate);
	const nestedStatus = directSignal.status ?? inheritedStatus;
	const hasDirectMessage = Boolean(directSignal.message?.trim());
	if (hasDirectMessage && isUnclassifiedNoBodyHttpSignal({
		...directSignal,
		status: nestedStatus
	})) return true;
	if (hasDirectMessage && (nestedCandidates.length === 0 || classifyFailoverSignal(directSignal))) return false;
	for (const nestedCandidate of nestedCandidates) {
		const decision = decideNestedFormatOverride(nestedCandidate, nestedStatus, seen, depth + 1);
		if (decision !== null) return decision;
	}
	return null;
}
function resolveFailoverClassificationFromErrorInternal(err, seen, depth, providerHint) {
	if (depth > MAX_FAILOVER_CAUSE_DEPTH) return null;
	if (err && typeof err === "object") {
		if (seen.has(err)) return null;
		seen.add(err);
	}
	if (isFailoverError(err)) {
		const classification = classifyFailoverSignal({
			...normalizeErrorSignal(err, providerHint),
			message: err.rawError ?? err.message
		});
		if (classification?.kind === "reason" && classification.sameModelRetry === false) return {
			kind: "reason",
			reason: err.reason,
			sameModelRetry: false
		};
		return {
			kind: "reason",
			reason: err.reason
		};
	}
	const signal = normalizeErrorSignal(err, providerHint);
	const classification = classifyFailoverSignal(signal);
	const nestedCandidates = getNestedErrorCandidates(err);
	if (!classification || classification.kind === "context_overflow") for (const candidate of nestedCandidates) {
		const nestedClassification = resolveFailoverClassificationFromErrorInternal(candidate, seen, depth + 1, providerHint);
		if (nestedClassification) return nestedClassification;
	}
	if (isFormatClassification(classification)) for (const candidate of nestedCandidates) {
		const shouldClearFormat = decideNestedFormatOverride(candidate, signal.status, seen, depth + 1);
		if (shouldClearFormat === true) return null;
		if (shouldClearFormat === false) break;
	}
	if (classification) return classification;
	if (isTimeoutError(err)) return {
		kind: "reason",
		reason: "timeout"
	};
	return null;
}
function resolveFailoverClassificationFromError(err, providerHint) {
	if (isAgentHarnessPreflightError(err)) return null;
	if (!isFailoverError(err) && hasRuntimeCoordinationFailure(err)) return null;
	return resolveFailoverClassificationFromErrorInternal(err, /* @__PURE__ */ new Set(), 0, providerHint);
}
/** Resolve the failover reason represented by an unknown provider/runtime error. */
function resolveFailoverReasonFromError(err, providerHint) {
	return failoverReasonFromClassification(resolveFailoverClassificationFromError(err, providerHint));
}
/** Build a copy-pasteable reauthentication hint for attributed auth failures. */
function buildFailoverRemediationHint(err) {
	if (!isFailoverError(err) || err.code === "selected_auth_profile_unavailable") return;
	if (err.reason !== "auth" && err.reason !== "auth_permanent") return;
	const provider = err.provider?.trim();
	if (!provider) return;
	if (provider === "google-gemini-cli") return `Authenticate in Gemini CLI directly, or configure a supported Google API key with: ${formatCliCommand("openclaw configure")}`;
	const command = buildProviderReauthCommand(provider);
	return command ? `Re-authenticate with: ${command}` : void 0;
}
function quotePosixShellArg(value) {
	return `'${value.replaceAll("'", "'\\''")}'`;
}
/** Build the operator command for reauthenticating one provider. */
function buildProviderReauthCommand(provider, env = process.env) {
	const trimmed = provider.trim();
	if (!trimmed || containsAsciiControlCharacter(trimmed)) return;
	return formatCliCommand(`openclaw models auth login --provider ${quotePosixShellArg(trimmed)} --force`, env);
}
/** Convert a failover or raw error into structured fields for logs/UI. */
function describeFailoverError(err) {
	if (isAgentHarnessPreflightError(err)) return { message: err.message };
	if (isFailoverError(err)) return {
		message: err.message,
		rawError: err.rawError,
		rateLimitRetriesExhausted: err.rateLimitRetriesExhausted,
		reason: err.reason,
		status: normalizeFailoverStatus(err.status, err.code),
		code: err.code,
		provider: err.provider,
		model: err.model,
		profileId: err.profileId,
		authMode: err.authMode,
		sessionId: err.sessionId,
		lane: err.lane
	};
	const signal = normalizeErrorSignal(err);
	return {
		message: signal.message ?? String(err),
		reason: resolveFailoverReasonFromError(err) ?? void 0,
		status: signal.status,
		code: signal.code,
		provider: signal.provider
	};
}
/** Convert a classified raw error into a FailoverError with optional request context. */
function coerceToFailoverError(err, context) {
	if (isFailoverError(err)) {
		const status = normalizeFailoverStatus(err.status, err.code);
		if (!Object.is(status, err.status) || context?.authMode && !err.authMode || context?.timeout && !err.timeout || context?.rateLimitRetriesExhausted !== void 0) {
			const message = typeof err.message === "string" ? err.message : String(err);
			const enriched = new FailoverError(renderRateLimitRetryExhaustion(context?.rateLimitRetriesExhausted) ?? message, {
				reason: err.reason,
				provider: err.provider,
				model: err.model,
				profileId: err.profileId,
				authMode: err.authMode ?? context?.authMode,
				status,
				code: err.code,
				rawError: err.rawError ?? (context?.rateLimitRetriesExhausted !== void 0 ? message : void 0),
				rateLimitRetriesExhausted: context?.rateLimitRetriesExhausted ?? err.rateLimitRetriesExhausted,
				authProfileFailure: err.authProfileFailure,
				sessionId: err.sessionId,
				lane: err.lane,
				cause: err.cause,
				suspend: err.suspend,
				cliTimeout: err.cliTimeout,
				timeout: err.timeout ?? context?.timeout,
				attempts: err.attempts,
				soonestCooldownExpiry: err.soonestCooldownExpiry
			});
			copyErrorDiagnostic(err, enriched);
			return enriched;
		}
		return err;
	}
	const reason = resolveFailoverReasonFromError(err, context?.provider);
	if (!reason) return null;
	const signal = normalizeErrorSignal(err);
	const message = signal.message ?? String(err);
	const code = signal.code;
	const status = context?.synthesizeHttpStatus === false ? signal.status : signal.status ?? resolveFailoverStatus(reason, code);
	const shouldSuspend = Boolean(context?.sessionId) && (reason === "rate_limit" || reason === "billing");
	return new FailoverError(renderRateLimitRetryExhaustion(context?.rateLimitRetriesExhausted) ?? message, {
		reason,
		rateLimitRetriesExhausted: context?.rateLimitRetriesExhausted,
		provider: context?.provider ?? signal.provider,
		model: context?.model,
		profileId: context?.profileId,
		authMode: context?.authMode,
		sessionId: context?.sessionId,
		lane: context?.lane,
		status,
		code,
		rawError: message,
		cause: err instanceof Error ? err : void 0,
		timeout: context?.timeout,
		suspend: shouldSuspend
	});
}
/** Classify one candidate failure once so fallback routing and diagnostics share it. */
function resolveModelFallbackError(err, context) {
	if (err instanceof AgentHarnessSessionSupersededError || isSqliteTranscriptMutationConflict(err)) return {
		kind: "coordination",
		error: err
	};
	if (hasPreparedModelRuntimeOwnerNotPublished(err)) return {
		kind: "coordination",
		error: err
	};
	if (hasRuntimeCoordinationFailure(err)) return {
		kind: "coordination",
		error: err
	};
	const staleLifecycleFailure = hasStaleAgentRunLifecycleFailure(err);
	if (staleLifecycleFailure && (isAgentRunStaleLifecycleError(err) || !hasDirectProviderFailureIdentity(err))) return {
		kind: "coordination",
		error: err
	};
	if (hasSessionTranscriptWriterClaimRebound(err)) return {
		kind: "coordination",
		error: err
	};
	if (hasModelFallbackStop(err)) return {
		kind: "terminal",
		error: err
	};
	if (isAgentHarnessPreflightError(err)) return {
		kind: "coordination",
		error: err
	};
	const failoverError = coerceToFailoverError(err, {
		...context,
		synthesizeHttpStatus: hasLocalWorkerTaskTimeout(err) ? false : context?.synthesizeHttpStatus
	});
	if (failoverError) return {
		kind: "failover",
		error: failoverError
	};
	if (hasMissingToolResultFailure(err) || staleLifecycleFailure) return {
		kind: "coordination",
		error: err
	};
	return {
		kind: "unknown",
		error: err
	};
}
//#endregion
export { findCliTerminalStopError as a, hasModelFallbackStop as c, isNonProviderRuntimeCoordinationError as d, resolveFailoverClassificationFromError as f, resolveModelFallbackError as h, describeFailoverError as i, hasRecordedModelFallbackStop as l, resolveFailoverStatus as m, buildProviderReauthCommand as n, findCliTimeoutError as o, resolveFailoverReasonFromError as p, coerceToFailoverError as r, hasLocalWorkerTaskTimeout as s, buildFailoverRemediationHint as t, isCliTerminalStopCode as u };
