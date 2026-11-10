import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { s as formatErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { f as isTrustedSecretSurfaceUnavailableError } from "./runtime-degraded-state-SptB0g_t.mjs";
import { s as attachInternalToolResultContentSource } from "./internal-hooks-CSjTREUl.mjs";
import "./tool-effect-receipt-BHVAm8DM.mjs";
import { r as isTrustedToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import { a as wrapExternalContent, i as truncateSanitizedExternalContent } from "./external-content-Bkm4w5qo.mjs";
//#region src/agents/tool-result-error.ts
const TOOL_TIMEOUT_ERROR_CODES = /* @__PURE__ */ new Set([
	"ERR_TIMEOUT",
	"ESOCKETTIMEDOUT",
	"ETIMEDOUT",
	"UND_ERR_BODY_TIMEOUT",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_HEADERS_TIMEOUT"
]);
const NETWORK_TOOL_ERROR_MAX_CHARS = 4e3;
const protectedNetworkToolErrors = /* @__PURE__ */ new WeakSet();
const protectedNetworkToolTimeoutErrors = /* @__PURE__ */ new WeakSet();
const TOOL_RESULT_FAILURE_STATUSES = /* @__PURE__ */ new Map([
	["error", "failed"],
	["failed", "failed"],
	["failure", "failed"],
	["timeout", "timed_out"],
	["timed_out", "timed_out"],
	["blocked", "blocked"],
	["denied", "blocked"],
	["forbidden", "blocked"],
	["unavailable", "failed"],
	["approval-unavailable", "blocked"],
	["disabled", "blocked"],
	["aborted", "cancelled"],
	["cancelled", "cancelled"],
	["canceled", "cancelled"],
	["killed", "cancelled"],
	["invalid", "failed"]
]);
function readToolErrorField(error, key) {
	try {
		return key in error ? error[key] : void 0;
	} catch {
		return;
	}
}
function hasStructuredToolTimeoutIdentity(error) {
	const pending = [error];
	const seen = /* @__PURE__ */ new Set();
	while (pending.length > 0 && seen.size < 8) {
		const current = pending.shift();
		if (!current || typeof current !== "object" || seen.has(current)) continue;
		seen.add(current);
		if (readToolErrorField(current, "name") === "TimeoutError") return true;
		const code = readToolErrorField(current, "code");
		if (typeof code === "string" && TOOL_TIMEOUT_ERROR_CODES.has(code.trim().toUpperCase())) return true;
		for (const key of ["reason", "status"]) {
			const value = readToolErrorField(current, key);
			const normalized = normalizeOptionalLowercaseString(value);
			if (normalized === "timeout" || normalized === "timed_out") return true;
			if (value && typeof value === "object") pending.push(value);
		}
		const cause = readToolErrorField(current, "cause");
		if (cause && typeof cause === "object") pending.push(cause);
	}
	return false;
}
function readToolResultDetails(result) {
	if (!result || typeof result !== "object") return;
	try {
		const details = readToolErrorField(result, "details");
		return details && typeof details === "object" && !Array.isArray(details) ? details : void 0;
	} catch {
		return;
	}
}
function readToolResultStatus(result) {
	const details = readToolResultDetails(result);
	return normalizeOptionalLowercaseString(details ? readToolErrorField(details, "status") : void 0);
}
function isToolResultError(result) {
	const details = readToolResultDetails(result);
	const normalized = readToolResultStatus(result);
	const ok = details ? readToolErrorField(details, "ok") : void 0;
	const success = details ? readToolErrorField(details, "success") : void 0;
	const explicitlySuccessful = ok === true || success === true;
	if (ok === false || success === false) return true;
	if (TOOL_RESULT_FAILURE_STATUSES.has(normalized ?? "") && !explicitlySuccessful) return true;
	const timedOut = details ? readToolErrorField(details, "timedOut") : void 0;
	const error = details ? readToolErrorField(details, "error") : void 0;
	if (timedOut === true || Boolean(error)) return true;
	if (normalized === "completed") return false;
	const exitCode = details ? readToolErrorField(details, "exitCode") : void 0;
	return typeof exitCode === "number" && Number.isFinite(exitCode) && exitCode !== 0;
}
/** Classify a thrown tool error without inferring cancellation from message text. */
function resolveToolExecutionErrorKind(error) {
	try {
		return typeof error === "object" && error !== null && protectedNetworkToolTimeoutErrors.has(error) || hasStructuredToolTimeoutIdentity(error) ? "timed_out" : "failed";
	} catch {
		return "failed";
	}
}
/** Authenticates host-owned preflight failures before a tool reaches untrusted network data. */
function isTrustedToolExecutionPreflightError(error) {
	return isTrustedSecretSurfaceUnavailableError(error) || isTrustedToolInputError(error);
}
/** Format a tool error without allowing hostile getters to escape observability. */
function formatToolExecutionErrorMessage(error, fallback) {
	try {
		return formatErrorMessage(error) || fallback;
	} catch {
		return fallback;
	}
}
/** Protect network-controlled failures once while preserving trusted cancellation and identity. */
function protectNetworkToolExecutionError(error, fallback, signal) {
	if (signal?.aborted && error === signal.reason || isTrustedToolExecutionPreflightError(error) || typeof error === "object" && error !== null && protectedNetworkToolErrors.has(error)) return error;
	const timedOut = resolveToolExecutionErrorKind(error) === "timed_out";
	const { text: message } = truncateSanitizedExternalContent(formatToolExecutionErrorMessage(error, fallback), NETWORK_TOOL_ERROR_MAX_CHARS);
	const protectedError = new Error(wrapExternalContent(message, { source: "api" }));
	Object.defineProperty(protectedError, "cause", { value: void 0 });
	try {
		if (error instanceof Error) {
			const prototype = Object.getPrototypeOf(error);
			if ([
				TypeError,
				RangeError,
				ReferenceError,
				SyntaxError,
				URIError,
				EvalError
			].some((kind) => prototype === kind.prototype)) Object.setPrototypeOf(protectedError, prototype);
			for (const key of [
				"name",
				"code",
				"status"
			]) {
				const value = Object.getOwnPropertyDescriptor(error, key)?.value;
				if (key === "status" ? typeof value === "number" && Number.isSafeInteger(value) : typeof value === "string" && /^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(value) && (key === "name" || value === value.toUpperCase())) Object.defineProperty(protectedError, key, {
					configurable: true,
					value
				});
			}
		}
	} catch {}
	protectedNetworkToolErrors.add(protectedError);
	attachInternalToolResultContentSource(protectedError, "network");
	if (timedOut) protectedNetworkToolTimeoutErrors.add(protectedError);
	return protectedError;
}
/** Classify a resolved structured tool result through the shared terminal contract. */
function resolveToolResultFailureKind(result) {
	if (!isToolResultError(result)) return;
	const statusKind = TOOL_RESULT_FAILURE_STATUSES.get(readToolResultStatus(result) ?? "");
	if (statusKind === "blocked") return "blocked";
	const details = readToolResultDetails(result);
	if ((details ? readToolErrorField(details, "timedOut") : void 0) === true || statusKind === "timed_out") return "timed_out";
	return statusKind ?? "failed";
}
//#endregion
export { readToolResultDetails as a, resolveToolResultFailureKind as c, protectNetworkToolExecutionError as i, isToolResultError as n, readToolResultStatus as o, isTrustedToolExecutionPreflightError as r, resolveToolExecutionErrorKind as s, formatToolExecutionErrorMessage as t };
