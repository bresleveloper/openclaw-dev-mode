import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { d as isTrustedSecretSurfaceUnavailableError } from "./runtime-degraded-state-DVMYGogL.mjs";
import { a as wrapExternalContent, i as truncateSanitizedExternalContent } from "./external-content-CLufk6dK.mjs";
import { r as isTrustedToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import { m as getInternalToolResultProvenance, s as attachInternalToolResultProvenance } from "./internal-hooks-DUPhyX-W.mjs";
//#region src/agents/tool-effect-receipt.ts
const NO_START_RECEIPT = Object.freeze({ state: "not_started" });
/** Keep effect proof private while the lifecycle copies or projects the result. */
function markToolExecutionNotStarted(value) {
	if (typeof value === "object" && value !== null) attachInternalToolResultProvenance(value, NO_START_RECEIPT);
	return value;
}
function readToolEffectReceipt(value) {
	return typeof value === "object" && value !== null && getInternalToolResultProvenance(value) === NO_START_RECEIPT ? NO_START_RECEIPT : void 0;
}
function consumeToolExecutionNotStarted(value) {
	if (typeof value !== "object" || value === null || getInternalToolResultProvenance(value) !== NO_START_RECEIPT) return false;
	attachInternalToolResultProvenance(value, void 0);
	return true;
}
/** The protected operation owns its first possible effect, including reservations. */
async function withToolEffectBoundary(execute) {
	let effectsStarted = false;
	const settle = (value) => {
		if (!effectsStarted) return markToolExecutionNotStarted(value);
		consumeToolExecutionNotStarted(value);
		return value;
	};
	try {
		return settle(await execute(() => {
			effectsStarted = true;
		}));
	} catch (error) {
		throw settle(error);
	}
}
/** Resolve the strongest effect fact available at the terminal lifecycle owner. */
function buildToolEffectReceipt(params) {
	if (!params.executionStarted) return { state: "uncertain" };
	if (params.replaySafe) return { state: params.outcome === "success" ? "read_completed" : "failed_no_effect" };
	return { state: params.mutatingAction && params.outcome === "success" ? "mutation_committed" : "uncertain" };
}
//#endregion
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
	if ((normalized === "error" || normalized === "failed" || normalized === "failure" || normalized === "timeout" || normalized === "timed_out" || normalized === "blocked" || normalized === "denied" || normalized === "forbidden" || normalized === "unavailable" || normalized === "approval-unavailable" || normalized === "disabled" || normalized === "aborted" || normalized === "cancelled" || normalized === "canceled" || normalized === "killed" || normalized === "invalid") && !explicitlySuccessful) return true;
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
/** Record host-owned proof that the protected operation never started, even if hooks ran. */
function registerTrustedToolNoStartError(error) {
	return markToolExecutionNotStarted(error);
}
/** Consume one private no-start fact at the next authoritative lifecycle boundary. */
function consumeTrustedToolNoStartError(error) {
	return consumeToolExecutionNotStarted(error);
}
/** Format a redacted tool error without allowing hostile getters to escape observability. */
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
	if (timedOut) protectedNetworkToolTimeoutErrors.add(protectedError);
	return protectedError;
}
/** Classify a resolved structured tool result through the shared terminal contract. */
function resolveToolResultFailureKind(result) {
	if (!isToolResultError(result)) return;
	const status = readToolResultStatus(result);
	if (status === "blocked" || status === "denied" || status === "forbidden" || status === "disabled" || status === "approval-unavailable") return "blocked";
	const details = readToolResultDetails(result);
	if ((details ? readToolErrorField(details, "timedOut") : void 0) === true || status === "timeout" || status === "timed_out") return "timed_out";
	if (status === "aborted" || status === "cancelled" || status === "canceled" || status === "killed") return "cancelled";
	return "failed";
}
//#endregion
export { protectNetworkToolExecutionError as a, registerTrustedToolNoStartError as c, buildToolEffectReceipt as d, markToolExecutionNotStarted as f, isTrustedToolExecutionPreflightError as i, resolveToolExecutionErrorKind as l, withToolEffectBoundary as m, formatToolExecutionErrorMessage as n, readToolResultDetails as o, readToolEffectReceipt as p, isToolResultError as r, readToolResultStatus as s, consumeTrustedToolNoStartError as t, resolveToolResultFailureKind as u };
