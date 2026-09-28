import { a as extractErrorCodeOrErrno, c as readErrorName, i as extractErrorCode, r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { i as restoreRuntimeTerminalState } from "./runtime-BC29JSZp.mjs";
import { n as isAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { i as readErrorCause, r as formatUncaughtError } from "./errors-DnjwnOju.mjs";
import { n as isTransientNetworkError } from "./retryable-network-errors-D2gJmBqw.mjs";
import { n as runFatalErrorHooks } from "./fatal-error-hooks-D8bswZzH.mjs";
import process from "node:process";
//#region src/infra/unhandled-rejections.ts
const HANDLERS_GLOBAL_KEY = Symbol.for("openclaw.unhandledRejection.handlers");
const EXCEPTION_HANDLERS_GLOBAL_KEY = Symbol.for("openclaw.uncaughtException.handlers");
const handlers = (() => {
	const g = globalThis;
	const existing = g[HANDLERS_GLOBAL_KEY];
	if (existing instanceof Set) return existing;
	const created = /* @__PURE__ */ new Set();
	g[HANDLERS_GLOBAL_KEY] = created;
	return created;
})();
const exceptionHandlers = (() => {
	const g = globalThis;
	const existing = g[EXCEPTION_HANDLERS_GLOBAL_KEY];
	if (existing instanceof Set) return existing;
	const created = /* @__PURE__ */ new Set();
	g[EXCEPTION_HANDLERS_GLOBAL_KEY] = created;
	return created;
})();
const FATAL_ERROR_CODES = /* @__PURE__ */ new Set([
	"ERR_OUT_OF_MEMORY",
	"ERR_SCRIPT_EXECUTION_TIMEOUT",
	"ERR_WORKER_OUT_OF_MEMORY",
	"ERR_WORKER_UNCAUGHT_EXCEPTION",
	"ERR_WORKER_INITIALIZATION_FAILED"
]);
const INVALID_CONFIG_ERROR_CODE = "INVALID_CONFIG";
const CONFIG_ERROR_CODES = /* @__PURE__ */ new Set([
	INVALID_CONFIG_ERROR_CODE,
	"MISSING_API_KEY",
	"MISSING_CREDENTIALS"
]);
const EXIT_CONFIG_ERROR = 78;
const TRANSIENT_SQLITE_CODES = /* @__PURE__ */ new Set([
	"SQLITE_BUSY",
	"SQLITE_CANTOPEN",
	"SQLITE_IOERR",
	"SQLITE_LOCKED"
]);
const TRANSIENT_SQLITE_ERRCODES = /* @__PURE__ */ new Set([
	5,
	6,
	10,
	14
]);
const BENIGN_UNCAUGHT_EXCEPTION_CODES = /* @__PURE__ */ new Set(["EPIPE", "EIO"]);
const BENIGN_UNCAUGHT_EXCEPTION_NETWORK_CODES = /* @__PURE__ */ new Set([
	"ECONNREFUSED",
	"ENETDOWN",
	"EHOSTUNREACH",
	"ENETUNREACH",
	"EADDRNOTAVAIL",
	"EAI_AGAIN",
	"ENOTFOUND",
	"ETIMEDOUT",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_DNS_RESOLVE_FAILED",
	"UND_ERR_CONNECT",
	"ERR_HTTP2_INVALID_SESSION"
]);
const BENIGN_UNCAUGHT_EXCEPTION_NETWORK_MESSAGE_CODE_RE = /\b(ECONNREFUSED|ENETDOWN|EHOSTUNREACH|ENETUNREACH|EADDRNOTAVAIL|EAI_AGAIN|ENOTFOUND|ETIMEDOUT|UND_ERR_CONNECT_TIMEOUT|UND_ERR_DNS_RESOLVE_FAILED|UND_ERR_CONNECT|ERR_HTTP2_INVALID_SESSION)\b/i;
const WS_PRE_HANDSHAKE_CLOSE_MESSAGE = "websocket was closed before the connection was established";
const UNDICI_TERMINATED_TYPE_ERROR_MESSAGE = "terminated";
const TRANSIENT_SQLITE_MESSAGE_CODE_RE = /\b(SQLITE_BUSY|SQLITE_CANTOPEN|SQLITE_IOERR|SQLITE_LOCKED)\b/i;
const TRANSIENT_SQLITE_MESSAGE_SNIPPETS = [
	"unable to open database file",
	"database is locked",
	"database table is locked",
	"disk i/o error"
];
function hasSqliteSignal(err) {
	if (!err || typeof err !== "object") return false;
	const code = extractErrorCode(err);
	if (typeof code === "string") {
		const normalizedCode = code.trim().toUpperCase();
		if (normalizedCode === "ERR_SQLITE_ERROR" || normalizedCode.startsWith("SQLITE_")) return true;
	}
	if (normalizeLowercaseStringOrEmpty(readErrorName(err)).includes("sqlite")) return true;
	if (("message" in err && typeof err.message === "string" ? normalizeLowercaseStringOrEmpty(err.message) : "").includes("sqlite")) return true;
	return false;
}
function isBenignUncaughtNetworkMessage(message) {
	if (BENIGN_UNCAUGHT_EXCEPTION_NETWORK_MESSAGE_CODE_RE.test(message)) return true;
	return message === WS_PRE_HANDSHAKE_CLOSE_MESSAGE;
}
function extractNumericErrorCode(err, key) {
	if (!err || typeof err !== "object") return;
	const value = err[key];
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && value.trim()) {
		const parsed = Number(value.trim());
		return Number.isFinite(parsed) ? parsed : void 0;
	}
}
function extractErrorCodeWithCause(err) {
	const direct = extractErrorCode(err);
	if (direct) return direct;
	return extractErrorCode(readErrorCause(err));
}
function isFatalError(err) {
	const code = extractErrorCodeWithCause(err);
	return code !== void 0 && FATAL_ERROR_CODES.has(code);
}
function isConfigError(err) {
	const code = extractErrorCodeWithCause(err);
	return code !== void 0 && CONFIG_ERROR_CODES.has(code);
}
function isTransientSqliteError(err) {
	if (!err) return false;
	for (const candidate of collectNestedErrorCandidates(err)) {
		const code = extractErrorCodeOrErrno(candidate);
		if (code && TRANSIENT_SQLITE_CODES.has(code)) return true;
		if (!hasSqliteSignal(candidate)) continue;
		const sqliteErrcode = extractNumericErrorCode(candidate, "errcode");
		if (sqliteErrcode !== void 0 && TRANSIENT_SQLITE_ERRCODES.has(sqliteErrcode)) return true;
		if (!candidate || typeof candidate !== "object") continue;
		const messageParts = [candidate.message, candidate.errstr];
		for (const rawMessage of messageParts) {
			const message = normalizeLowercaseStringOrEmpty(rawMessage);
			if (!message) continue;
			if (TRANSIENT_SQLITE_MESSAGE_CODE_RE.test(message)) return true;
			if (TRANSIENT_SQLITE_MESSAGE_SNIPPETS.some((snippet) => message.includes(snippet))) return true;
		}
	}
	return false;
}
/**
* Checks if an error is a transient file watcher error that shouldn't crash the gateway.
* These are typically resource exhaustion issues (e.g., inotify watches exhausted) that
* can be recovered from by degrading to manual sync mode.
*
* Note: ENOSPC is a general POSIX error code (disk full, write failures, etc.).
* To avoid misclassifying unrelated storage failures, we require both the ENOSPC code
* AND a watch/inotify-related message indicator, similar to how hasSqliteSignal gates
* SQLite errors.
*/
function isTransientFileWatchError(err) {
	if (!err) return false;
	const hasFileWatchSignal = (message) => message.includes("inotify") || message.includes("watcher") || message.includes("file watcher") || message.includes("watch limit") || message.includes("max watches");
	const hasFileWatchExhaustionSignal = (message) => message.includes("inotify watches") || message.includes("inotify watch") || message.includes("system limit for number of file watchers") || message.includes("watch limit") || message.includes("max watches");
	for (const candidate of collectNestedErrorCandidates(err)) {
		if (!candidate || typeof candidate !== "object") continue;
		const code = extractErrorCodeOrErrno(candidate);
		const rawMessage = "message" in candidate && typeof candidate.message === "string" ? candidate.message : "";
		const message = normalizeLowercaseStringOrEmpty(rawMessage);
		if (code === "ENOSPC") {
			if (hasFileWatchSignal(message)) return true;
			continue;
		}
		if (!message) continue;
		if (message.includes("no space left on device") && hasFileWatchSignal(message) || hasFileWatchExhaustionSignal(message)) return true;
	}
	return false;
}
function isTransientUnhandledRejectionError(err) {
	return isTransientNetworkError(err) || isTransientSqliteError(err) || isTransientFileWatchError(err);
}
function isBenignUncaughtNetworkException(err) {
	for (const candidate of collectNestedErrorCandidates(err)) {
		if (candidate instanceof TypeError && normalizeLowercaseStringOrEmpty(candidate.message) === UNDICI_TERMINATED_TYPE_ERROR_MESSAGE) return true;
		const code = extractErrorCodeOrErrno(candidate);
		if (code && BENIGN_UNCAUGHT_EXCEPTION_NETWORK_CODES.has(code)) return true;
		if (!candidate || typeof candidate !== "object") continue;
		const message = normalizeLowercaseStringOrEmpty(candidate.message);
		if (message && isBenignUncaughtNetworkMessage(message)) return true;
	}
	return false;
}
function isBenignUncaughtExceptionError(err) {
	if (isBenignUncaughtNetworkException(err)) return true;
	for (const candidate of collectNestedErrorCandidates(err)) {
		const code = extractErrorCodeOrErrno(candidate);
		if (code && BENIGN_UNCAUGHT_EXCEPTION_CODES.has(code)) return true;
	}
	return false;
}
function registerUnhandledRejectionHandler(handler) {
	handlers.add(handler);
	return () => {
		handlers.delete(handler);
	};
}
function isUnhandledRejectionHandled(reason) {
	for (const handler of handlers) try {
		if (handler(reason)) return true;
	} catch (err) {
		console.error("[openclaw] Unhandled rejection handler failed:", err instanceof Error ? err.stack ?? err.message : err);
	}
	return false;
}
function registerUncaughtExceptionHandler(handler) {
	exceptionHandlers.add(handler);
	return () => {
		exceptionHandlers.delete(handler);
	};
}
function isUncaughtExceptionHandled(error) {
	for (const handler of exceptionHandlers) try {
		if (handler(error)) return true;
	} catch (err) {
		console.error("[openclaw] Uncaught exception handler failed:", err instanceof Error ? err.stack ?? err.message : err);
	}
	return false;
}
function installUnhandledRejectionHandler() {
	const exitWithTerminalRestore = (reason, error, hookReason = reason, exitCode = 1) => {
		for (const message of runFatalErrorHooks({
			reason: hookReason,
			error
		})) console.error("[openclaw]", message);
		restoreRuntimeTerminalState(reason, { resumeStdinIfPaused: false });
		process.exit(exitCode);
	};
	process.on("unhandledRejection", (reason, _promise) => {
		if (isUnhandledRejectionHandled(reason)) return;
		if (isAbortError(reason)) {
			console.warn("[openclaw] Suppressed AbortError:", formatUncaughtError(reason));
			return;
		}
		if (isFatalError(reason)) {
			console.error("[openclaw] FATAL unhandled rejection:", formatUncaughtError(reason));
			exitWithTerminalRestore("fatal unhandled rejection", reason, "fatal_unhandled_rejection");
			return;
		}
		if (isConfigError(reason)) {
			console.error("[openclaw] CONFIGURATION ERROR - requires fix:", formatUncaughtError(reason));
			const exitCode = extractErrorCodeWithCause(reason) === INVALID_CONFIG_ERROR_CODE ? EXIT_CONFIG_ERROR : 1;
			exitWithTerminalRestore("configuration error", reason, "configuration_error", exitCode);
			return;
		}
		if (isTransientUnhandledRejectionError(reason)) {
			console.warn("[openclaw] Non-fatal unhandled rejection (continuing):", formatUncaughtError(reason));
			return;
		}
		console.error("[openclaw] Unhandled promise rejection:", formatUncaughtError(reason));
		exitWithTerminalRestore("unhandled rejection", reason, "unhandled_rejection");
	});
}
//#endregion
export { isTransientUnhandledRejectionError as a, registerUnhandledRejectionHandler as c, isTransientSqliteError as i, isBenignUncaughtExceptionError as n, isUncaughtExceptionHandled as o, isTransientFileWatchError as r, registerUncaughtExceptionHandler as s, installUnhandledRejectionHandler as t };
