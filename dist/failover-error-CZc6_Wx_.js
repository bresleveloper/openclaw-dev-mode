import { y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import { c as readErrorName } from "./errors-DCRXIYSQ.js";
import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { r as isSessionWriteLockAcquireError } from "./session-write-lock-error-CYOzPsPk.js";
import { y as isTimeoutErrorMessage } from "./sanitize-user-facing-text-CRgdQ8Wr.js";
import { T as isUnclassifiedNoBodyHttpSignal, i as classifyFailoverSignal, o as extractFailoverSignalDetails, u as inferSignalStatus } from "./errors-C4-qHiKh.js";
//#region src/agents/failover-error.ts
/**
* Provider/model failover error classification.
* Converts nested provider, transport, timeout, auth, and local coordination
* failures into structured failover reasons and remediation metadata.
*/
const ABORT_TIMEOUT_RE = /request was aborted|request aborted/i;
const MAX_FAILOVER_CAUSE_DEPTH = 25;
/** Structured error used to carry model fallback/failover metadata across layers. */
var FailoverError = class extends Error {
	constructor(message, params) {
		super(message, { cause: params.cause });
		this.name = "FailoverError";
		this.reason = params.reason;
		this.provider = params.provider;
		this.model = params.model;
		this.profileId = params.profileId;
		this.authMode = params.authMode;
		this.status = params.status;
		this.code = params.code;
		this.rawError = params.rawError;
		this.authProfileFailure = params.authProfileFailure;
		this.sessionId = params.sessionId;
		this.lane = params.lane;
		this.suspend = params.suspend;
	}
};
/** Return true for native or serialized failover errors. */
function isFailoverError(err) {
	if (err instanceof FailoverError) return true;
	return Boolean(err && typeof err === "object" && err.name === "FailoverError" && typeof err.reason === "string");
}
/** Map a failover reason to the closest HTTP-like status code. */
function resolveFailoverStatus(reason) {
	switch (reason) {
		case "billing": return 402;
		case "server_error": return 500;
		case "rate_limit": return 429;
		case "overloaded": return 503;
		case "auth": return 401;
		case "auth_permanent": return 403;
		case "timeout": return 408;
		case "format": return 400;
		case "model_not_found": return 404;
		case "session_expired": return 410;
		default: return;
	}
}
function findErrorProperty(err, reader, seen = /* @__PURE__ */ new Set()) {
	const direct = reader(err);
	if (direct !== void 0) return direct;
	if (!err || typeof err !== "object") return;
	if (seen.has(err)) return;
	seen.add(err);
	const candidate = err;
	return findErrorProperty(candidate.error, reader, seen) ?? findErrorProperty(candidate.cause, reader, seen);
}
function readDirectStatusCode(err) {
	if (!err || typeof err !== "object") return;
	const candidate = err.status ?? err.statusCode;
	if (typeof candidate === "number") return candidate;
	if (typeof candidate === "string") return parseStrictNonNegativeInteger(candidate);
}
function getStatusCode(err) {
	return findErrorProperty(err, readDirectStatusCode);
}
function readDirectErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const directCode = err.code;
	if (typeof directCode === "string") {
		const trimmed = directCode.trim();
		return trimmed ? trimmed : void 0;
	}
	const detailCode = err.detail?.code;
	if (typeof detailCode === "string") {
		const trimmed = detailCode.trim();
		return trimmed ? trimmed : void 0;
	}
	const status = err.status;
	if (typeof status !== "string" || /^\d+$/.test(status)) return;
	const trimmed = status.trim();
	return trimmed ? trimmed : void 0;
}
function getErrorCode(err) {
	return findErrorProperty(err, readDirectErrorCode);
}
function isStableProviderErrorType(value) {
	if (/^(?:api|authentication|invalid_request|not_found|overloaded|permission|rate_limit|server)_error$/i.test(value)) return false;
	return /^[A-Z][A-Z0-9_:-]*$/.test(value);
}
function readDirectErrorType(err) {
	if (!err || typeof err !== "object") return;
	const directType = err.errorType;
	if (typeof directType === "string") {
		const trimmed = directType.trim();
		return trimmed && isStableProviderErrorType(trimmed) ? trimmed : void 0;
	}
	const detailType = err.detail?.type;
	if (typeof detailType === "string") {
		const trimmed = detailType.trim();
		return trimmed && isStableProviderErrorType(trimmed) ? trimmed : void 0;
	}
	const type = err.type;
	if (typeof type === "string") {
		const trimmed = type.trim();
		if (!trimmed || /^(?:error|exception)$/i.test(trimmed)) return;
		return isStableProviderErrorType(trimmed) ? trimmed : void 0;
	}
}
function getErrorType(err) {
	return findErrorProperty(err, readDirectErrorType);
}
function readDirectProvider(err) {
	if (!err || typeof err !== "object") return;
	const provider = err.provider;
	if (typeof provider !== "string") return;
	return provider.trim() || void 0;
}
function getProvider(err) {
	return findErrorProperty(err, readDirectProvider);
}
function readDirectErrorDetails(err) {
	if (!err || typeof err !== "object") return;
	const candidate = err;
	return extractFailoverSignalDetails(candidate.param, candidate.errorBody, candidate.body, candidate.detail, candidate.error);
}
function readDirectErrorMessage(err) {
	if (err instanceof Error) return err.message || void 0;
	if (typeof err === "string") return err || void 0;
	if (typeof err === "number" || typeof err === "boolean" || typeof err === "bigint") return String(err);
	if (typeof err === "symbol") return err.description ?? void 0;
	if (err && typeof err === "object") {
		const message = err.message;
		if (typeof message === "string") return message || void 0;
	}
}
function getErrorMessage(err) {
	return findErrorProperty(err, readDirectErrorMessage) ?? "";
}
function normalizeDirectErrorSignal(err) {
	const message = readDirectErrorMessage(err);
	return {
		status: readDirectStatusCode(err),
		code: readDirectErrorCode(err),
		errorType: readDirectErrorType(err),
		message: message || void 0,
		provider: readDirectProvider(err),
		details: readDirectErrorDetails(err)
	};
}
function hasSessionWriteLockContention(err, seen = /* @__PURE__ */ new Set()) {
	if (isSessionWriteLockAcquireError(err)) return true;
	if (!err || typeof err !== "object") return false;
	if (seen.has(err)) return false;
	seen.add(err);
	const candidate = err;
	return hasSessionWriteLockContention(candidate.error, seen) || hasSessionWriteLockContention(candidate.cause, seen) || hasSessionWriteLockContention(candidate.reason, seen);
}
function isEmbeddedAttemptSessionTakeover(err) {
	return Boolean(err && typeof err === "object" && readErrorName(err) === "EmbeddedAttemptSessionTakeoverError");
}
function hasEmbeddedAttemptSessionTakeover(err, seen = /* @__PURE__ */ new Set()) {
	if (isEmbeddedAttemptSessionTakeover(err)) return true;
	if (!err || typeof err !== "object") return false;
	if (seen.has(err)) return false;
	seen.add(err);
	const candidate = err;
	return hasEmbeddedAttemptSessionTakeover(candidate.error, seen) || hasEmbeddedAttemptSessionTakeover(candidate.cause, seen) || hasEmbeddedAttemptSessionTakeover(candidate.reason, seen);
}
/**
* True when the error is a local runtime coordination error (session write-lock
* timeout or embedded attempt session takeover) rather than a provider/model
* failure. The model fallback chain must abort on these instead of consuming
* candidate slots — retrying any model would hit the same local condition.
* See #83510.
*/
function isNonProviderRuntimeCoordinationError(err) {
	if (!hasSessionWriteLockContention(err) && !hasEmbeddedAttemptSessionTakeover(err)) return false;
	if (isFailoverError(err)) return false;
	if (isEmbeddedAttemptSessionTakeover(err)) return true;
	return resolveFailoverClassificationFromError(err) === null;
}
function hasTimeoutHint(err) {
	if (!err) return false;
	if (hasSessionWriteLockContention(err)) return false;
	if (readErrorName(err) === "TimeoutError") return true;
	const message = getErrorMessage(err);
	return Boolean(message && isTimeoutErrorMessage(message));
}
/** Return true when an unknown error shape represents a timeout. */
function isTimeoutError(err) {
	if (hasTimeoutHint(err)) return true;
	if (!err || typeof err !== "object") return false;
	if (readErrorName(err) !== "AbortError") return false;
	if (hasSessionWriteLockContention(err)) return false;
	const message = getErrorMessage(err);
	if (message && ABORT_TIMEOUT_RE.test(message)) return true;
	const cause = "cause" in err ? err.cause : void 0;
	const reason = "reason" in err ? err.reason : void 0;
	return hasTimeoutHint(cause) || hasTimeoutHint(reason);
}
/** Return true when an abort-signal reason is an intentional timeout; plain AbortError is a cancellation, not a timeout. */
function isSignalTimeoutReason(reason) {
	return readErrorName(reason) === "TimeoutError";
}
function failoverReasonFromClassification(classification) {
	return classification?.kind === "reason" ? classification.reason : null;
}
function normalizeErrorSignal(err, providerHint) {
	const message = getErrorMessage(err);
	return {
		status: getStatusCode(err),
		code: getErrorCode(err),
		errorType: getErrorType(err),
		message: message || void 0,
		provider: getProvider(err) ?? providerHint,
		details: readDirectErrorDetails(err)
	};
}
function getNestedErrorCandidates(err) {
	if (!err || typeof err !== "object") return [];
	const candidate = err;
	return [candidate.error, candidate.cause].filter((value) => value !== void 0 && value !== err);
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
	const codeReason = signal.code ? failoverReasonFromClassification(classifyFailoverSignal({ code: signal.code })) : null;
	const hasExplicitFailoverMetadata = typeof inferSignalStatus(signal) === "number" || codeReason !== null && codeReason !== "timeout";
	const hasSessionLock = hasSessionWriteLockContention(err);
	const classification = classifyFailoverSignal(signal);
	const nestedCandidates = getNestedErrorCandidates(err);
	if (!classification || classification.kind === "context_overflow") for (const candidate of nestedCandidates) {
		const nestedClassification = resolveFailoverClassificationFromErrorInternal(candidate, seen, depth + 1, providerHint);
		if (nestedClassification) {
			if (hasSessionLock && !hasExplicitFailoverMetadata) return null;
			return nestedClassification;
		}
	}
	if (isFormatClassification(classification)) for (const candidate of nestedCandidates) {
		const shouldClearFormat = decideNestedFormatOverride(candidate, signal.status, seen, depth + 1);
		if (shouldClearFormat === true) return null;
		if (shouldClearFormat === false) break;
	}
	if (classification) {
		if (hasSessionLock && !hasExplicitFailoverMetadata) return null;
		return classification;
	}
	if (hasSessionLock) return null;
	if (isTimeoutError(err)) return {
		kind: "reason",
		reason: "timeout"
	};
	return null;
}
function resolveFailoverClassificationFromError(err, providerHint) {
	return resolveFailoverClassificationFromErrorInternal(err, /* @__PURE__ */ new Set(), 0, providerHint);
}
/** Resolve the failover reason represented by an unknown provider/runtime error. */
function resolveFailoverReasonFromError(err, providerHint) {
	return failoverReasonFromClassification(resolveFailoverClassificationFromError(err, providerHint));
}
/**
* Build an actionable remediation hint for a failover error when the failure
* reason is `auth` / `auth_permanent` and we have enough provider attribution
* to suggest a re-authentication command. Returns `undefined` for any other
* failure shape so callers can opportunistically append the hint without
* branching on every reason themselves.
*
* Keep the string short and copy-pasteable — operators see it in fallback
* summary errors and TUI status lines.
*/
function buildFailoverRemediationHint(err) {
	if (!isFailoverError(err)) return;
	if (err.reason !== "auth" && err.reason !== "auth_permanent") return;
	const provider = err.provider?.trim();
	if (!provider) return;
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
	if (isFailoverError(err)) return {
		message: err.message,
		rawError: err.rawError,
		reason: err.reason,
		status: err.status,
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
		if (context?.authMode && !err.authMode) return new FailoverError(typeof err.message === "string" ? err.message : String(err), {
			reason: err.reason,
			provider: err.provider,
			model: err.model,
			profileId: err.profileId,
			authMode: context.authMode,
			status: err.status,
			code: err.code,
			rawError: err.rawError,
			authProfileFailure: err.authProfileFailure,
			sessionId: err.sessionId,
			lane: err.lane,
			cause: err.cause,
			suspend: err.suspend
		});
		return err;
	}
	const reason = resolveFailoverReasonFromError(err, context?.provider);
	if (!reason) return null;
	const signal = normalizeErrorSignal(err);
	const message = signal.message ?? String(err);
	const status = signal.status ?? resolveFailoverStatus(reason);
	const code = signal.code;
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
		suspend: shouldSuspend
	});
}
//#endregion
export { describeFailoverError as a, isSignalTimeoutReason as c, resolveFailoverStatus as d, coerceToFailoverError as i, isTimeoutError as l, buildFailoverRemediationHint as n, isFailoverError as o, buildProviderReauthCommand as r, isNonProviderRuntimeCoordinationError as s, FailoverError as t, resolveFailoverReasonFromError as u };
