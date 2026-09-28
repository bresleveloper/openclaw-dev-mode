import { c as readErrorName } from "./error-coercion-C787aVxk.mjs";
import { i as asOptionalObjectRecord, u as readStringField } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { m as isTimeoutErrorMessage, u as isProviderRequestSizeCeilingError } from "./message-patterns-D0mFl7L8.mjs";
//#region src/agents/failover/error.ts
const ABORT_TIMEOUT_RE = /request was aborted|request aborted/i;
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
		this.requestSizeCeiling = isProviderRequestSizeCeilingError(params.rawError ?? message);
		this.authProfileFailure = params.authProfileFailure;
		this.sessionId = params.sessionId;
		this.lane = params.lane;
		this.suspend = params.suspend;
		this.cliTimeout = params.cliTimeout;
		this.timeout = params.timeout;
		this.attempts = params.attempts;
		this.soonestCooldownExpiry = params.soonestCooldownExpiry;
	}
};
/** Return true for native or serialized failover errors. */
function isFailoverError(err) {
	if (err instanceof FailoverError) return true;
	const candidate = asOptionalObjectRecord(err);
	return candidate?.name === "FailoverError" && typeof candidate.reason === "string";
}
function findErrorProperty(err, reader, seen = /* @__PURE__ */ new Set()) {
	const direct = reader(err);
	if (direct !== void 0) return direct;
	const candidate = asOptionalObjectRecord(err);
	if (!candidate || seen.has(candidate)) return;
	seen.add(candidate);
	return findErrorProperty(candidate.error, reader, seen) ?? findErrorProperty(candidate.cause, reader, seen);
}
function readDirectErrorCode(err) {
	const candidate = asOptionalObjectRecord(err);
	if (!candidate) return;
	const directCode = candidate.code;
	if (typeof directCode === "string") return normalizeOptionalString(directCode);
	const detailCode = candidate.detail?.code;
	if (typeof detailCode === "string") return normalizeOptionalString(detailCode);
	const status = candidate.status;
	if (typeof status !== "string" || /^\d+$/.test(status)) return;
	return normalizeOptionalString(status);
}
function getFailoverErrorCode(err) {
	return isFailoverError(err) ? err.code : findErrorProperty(err, readDirectErrorCode);
}
function readDirectErrorMessage(err) {
	if (err instanceof Error) return err.message || void 0;
	if (typeof err === "string") return err || void 0;
	if (typeof err === "number" || typeof err === "boolean" || typeof err === "bigint") return String(err);
	if (typeof err === "symbol") return err.description ?? void 0;
	return readStringField(asOptionalObjectRecord(err), "message") || void 0;
}
function getErrorMessage(err) {
	return findErrorProperty(err, readDirectErrorMessage) ?? "";
}
function hasTimeoutHint(err) {
	if (!err) return false;
	if (readErrorName(err) === "TimeoutError") return true;
	const message = getErrorMessage(err);
	return Boolean(message && isTimeoutErrorMessage(message));
}
/** Return true when an unknown error shape represents a timeout. */
function isTimeoutError(err) {
	if (hasTimeoutHint(err)) return true;
	if (!err || typeof err !== "object") return false;
	if (readErrorName(err) !== "AbortError") return false;
	const message = getErrorMessage(err);
	if (message && ABORT_TIMEOUT_RE.test(message)) return true;
	const cause = "cause" in err ? err.cause : void 0;
	const reason = "reason" in err ? err.reason : void 0;
	return hasTimeoutHint(cause) || hasTimeoutHint(reason);
}
/** Return true when an abort-signal reason is an intentional timeout; plain AbortError is a cancellation, not a timeout. */
function isSignalTimeoutReason(reason) {
	try {
		return readErrorName(reason) === "TimeoutError";
	} catch {
		return false;
	}
}
//#endregion
export { isFailoverError as a, readDirectErrorCode as c, getFailoverErrorCode as i, readDirectErrorMessage as l, findErrorProperty as n, isSignalTimeoutReason as o, getErrorMessage as r, isTimeoutError as s, FailoverError as t };
