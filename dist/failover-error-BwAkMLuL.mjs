import { C as parseStrictNonNegativeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { c as readErrorName, n as collectErrorGraphCandidates } from "./error-coercion-C787aVxk.mjs";
import { i as asOptionalObjectRecord, u as readStringField } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { x as isAgentRunStaleLifecycleError } from "./agent-events-BOSJcayE.mjs";
import { u as isProviderRequestSizeCeilingError } from "./message-patterns-D0mFl7L8.mjs";
import { a as isFailoverError, c as readDirectErrorCode, l as readDirectErrorMessage, n as findErrorProperty, r as getErrorMessage, s as isTimeoutError, t as FailoverError } from "./error-ON38hPhx.mjs";
import { i as isAgentHarnessPreflightError, n as AgentHarnessSessionSupersededError } from "./errors-Bd6GQRkh.mjs";
import { n as copyErrorDiagnostic } from "./error-diagnostics-805LTf-V.mjs";
import { d as isAgentRunSupersededAbortReason, f as isSessionPlacementSettlementClosedError } from "./run-termination-Cd1iJzC7.mjs";
import { l as failoverReasonFromClassification, p as isUnclassifiedNoBodyHttpSignal } from "./classify-core-BTxG3xnT.mjs";
import { t as extractFailoverSignalDetails } from "./signal-details-t7AcFsUH.mjs";
import { n as classifyFailoverSignal } from "./classify-Bgiif0yb.mjs";
import { t as isRecordedModelFallbackStop } from "./model-fallback-stop-B0RY23Zf.mjs";
//#region src/agents/failover-error.ts
const MAX_FAILOVER_CAUSE_DEPTH = 25;
const MISSING_TOOL_RESULT_REASON = "missing_tool_result";
const MISSING_TOOL_RESULT_TEXT_RE = /native Codex tool\.call without a matching tool\.result/i;
const RUNTIME_COORDINATION_ERROR_NAMES = /* @__PURE__ */ new Set([
	"GatewayDrainingError",
	"WorkerRunnerUnavailableError",
	"WorkerRunnerCapacityError",
	"WorkerWorkspaceReconciliationError",
	"ActiveTurnClaimError"
]);
function hasRecordedModelFallbackStop(error) {
	return collectErrorGraphCandidates(error, resolveNestedErrors).some(isRecordedModelFallbackStop);
}
function hasModelFallbackStop(error) {
	return isSessionPlacementSettlementClosedError(error) || isAgentRunSupersededAbortReason(error) || collectErrorGraphCandidates(error, resolveNestedErrors).some((candidate) => isRecordedModelFallbackStop(candidate) || isFailoverError(candidate) && isCliTerminalStopCode(candidate.code));
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
/** Distinguishes the provider's request ceiling from context pressure and bucket state. */
function hasProviderRequestSizeCeiling(err) {
	return collectErrorGraphCandidates(err, resolveNestedErrors).some((candidate) => isFailoverError(candidate) ? candidate.requestSizeCeiling : isProviderRequestSizeCeilingError(formatErrorMessage(candidate)));
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
function normalizeDirectErrorSignal(err) {
	const message = readDirectErrorMessage(err);
	const code = readDirectErrorCode(err);
	return {
		status: normalizeFailoverStatus(readDirectStatusCode(err), code),
		code,
		errorType: readDirectErrorType(err),
		message: message || void 0,
		provider: readDirectProvider(err),
		details: readDirectErrorDetails(err)
	};
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
	return collectErrorGraphCandidates(err, resolveNestedErrors).some((candidate) => RUNTIME_COORDINATION_ERROR_NAMES.has(readErrorName(candidate)));
}
function hasDirectProviderFailureIdentity(err) {
	if (isFailoverError(err)) return true;
	const signal = normalizeDirectErrorSignal(err);
	return Boolean(signal.status || signal.code || signal.errorType || signal.provider);
}
/** Local coordination failures stop fallback because changing models cannot repair them. */
function isNonProviderRuntimeCoordinationError(err) {
	return resolveModelFallbackError(err).kind === "coordination";
}
function normalizeErrorSignal(err, providerHint) {
	const message = getErrorMessage(err);
	const code = findErrorProperty(err, readDirectErrorCode);
	return {
		status: normalizeFailoverStatus(findErrorProperty(err, readDirectStatusCode), code),
		code,
		errorType: findErrorProperty(err, readDirectErrorType),
		message: message || void 0,
		provider: findErrorProperty(err, readDirectProvider) ?? providerHint,
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
	const directSignal = normalizeDirectErrorSignal(candidate);
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
	if (isFailoverError(err)) return {
		kind: "reason",
		reason: err.reason
	};
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
	if (!trimmed || hasControlCharacter(trimmed)) return;
	return formatCliCommand(`openclaw models auth login --provider ${quotePosixShellArg(trimmed)} --force`, env);
}
function hasControlCharacter(value) {
	for (let i = 0; i < value.length; i += 1) {
		const code = value.charCodeAt(i);
		if (code < 32 || code === 127) return true;
	}
	return false;
}
/** Convert a failover or raw error into structured fields for logs/UI. */
function describeFailoverError(err) {
	if (isAgentHarnessPreflightError(err)) return { message: err.message };
	if (isFailoverError(err)) return {
		message: err.message,
		rawError: err.rawError,
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
		if (!Object.is(status, err.status) || context?.authMode && !err.authMode || context?.timeout && !err.timeout) {
			const message = typeof err.message === "string" ? err.message : String(err);
			const enriched = new FailoverError(message, {
				reason: err.reason,
				provider: err.provider,
				model: err.model,
				profileId: err.profileId,
				authMode: err.authMode ?? context?.authMode,
				status,
				code: err.code,
				rawError: err.rawError,
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
	const status = signal.status ?? resolveFailoverStatus(reason, code);
	const shouldSuspend = Boolean(context?.sessionId) && (reason === "rate_limit" || reason === "billing");
	return new FailoverError(message, {
		reason,
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
	if (err instanceof AgentHarnessSessionSupersededError) return {
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
	const failoverError = coerceToFailoverError(err, context);
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
export { findCliTerminalStopError as a, hasProviderRequestSizeCeiling as c, isNonProviderRuntimeCoordinationError as d, resolveFailoverReasonFromError as f, describeFailoverError as i, hasRecordedModelFallbackStop as l, resolveModelFallbackError as m, buildProviderReauthCommand as n, findCliTimeoutError as o, resolveFailoverStatus as p, coerceToFailoverError as r, hasModelFallbackStop as s, buildFailoverRemediationHint as t, isCliTerminalStopCode as u };
